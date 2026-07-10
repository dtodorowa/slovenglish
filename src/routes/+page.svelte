<script lang="ts">
	import { store } from '$lib/store.svelte';
	import { speech } from '$lib/speech.svelte';
	import StarButton from '$lib/StarButton.svelte';

	// A phrase queued from the Starred/History page opens here already translated.
	const queued = store.pending;
	store.pending = null;

	let english = $state(queued?.en ?? '');
	let slovenian = $state(queued?.sl ?? '');
	let loading = $state(false);
	let errorMsg = $state('');

	// Plain (non-reactive) flag: when a phrase is loaded from another page we already
	// have its translation, so the effect skips one run instead of re-translating.
	let skipText: string | null = queued ? queued.en.trim() || null : null;

	let listening = $state(false);
	// webkitSpeechRecognition isn't in the DOM types; keep it loosely typed.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const SpeechRecognitionCtor: any =
		typeof window !== 'undefined' &&
		((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
	const sttSupported = Boolean(SpeechRecognitionCtor);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let recognition: any = null;

	let controller: AbortController | null = null;

	// Debounce typing, then translate. Aborts the in-flight request on each keystroke
	// so a slow response can't overwrite a newer one.
	$effect(() => {
		const text = english.trim();
		controller?.abort();

		if (!text) {
			slovenian = '';
			errorMsg = '';
			loading = false;
			return;
		}

		// Loaded from history/starred: keep the translation we already have, don't refetch.
		if (text === skipText) {
			skipText = null;
			return;
		}

		const timer = setTimeout(() => translate(text), 350);
		return () => clearTimeout(timer);
	});

	async function translate(text: string) {
		controller = new AbortController();
		loading = true;
		errorMsg = '';

		try {
			const res = await fetch('/api/translate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text }),
				signal: controller.signal
			});
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(body?.message ?? `Translation failed (${res.status})`);
			}
			slovenian = (await res.json()).translation;
			store.add(text, slovenian, Date.now());
		} catch (e) {
			if ((e as Error).name === 'AbortError') return;
			errorMsg = (e as Error).message;
		} finally {
			loading = false;
		}
	}

	function dictate() {
		if (!sttSupported) return;

		// Second tap stops an in-progress dictation.
		if (listening) {
			recognition?.stop();
			return;
		}

		recognition = new SpeechRecognitionCtor();
		recognition.lang = 'en-US';
		recognition.interimResults = true;
		recognition.continuous = false;

		recognition.onstart = () => (listening = true);
		recognition.onend = () => (listening = false);
		recognition.onerror = () => (listening = false);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		recognition.onresult = (event: any) => {
			let transcript = '';
			for (const result of event.results) transcript += result[0].transcript;
			english = transcript;
		};

		english = '';
		recognition.start();
	}

	const speaking = $derived(!!slovenian && speech.speakingText === slovenian);
</script>

<svelte:head>
	<title>Slovenglish</title>
</svelte:head>

<main class="flex h-full flex-col bg-white">
	<!-- Top half: type English -->
	<section class="relative flex flex-1 flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))]">
		<span class="text-[0.7rem] font-extrabold tracking-[0.25em] text-slate-400 uppercase"
			>English</span
		>
		<textarea
			bind:value={english}
			placeholder="Say it…"
			autocapitalize="sentences"
			class="mt-2 w-full flex-1 resize-none bg-transparent pr-20 text-[2.5rem] leading-[1.1]
			       font-bold tracking-tight text-slate-900 outline-none placeholder:text-slate-300"></textarea>

		{#if sttSupported}
			<!-- Mic button, mirroring the speaker below: tap to dictate English -->
			<button
				onclick={dictate}
				aria-label={listening ? 'Stop dictation' : 'Dictate English'}
				class="absolute right-5 bottom-5 flex h-16 w-16 items-center justify-center rounded-full
				       text-white shadow-lg transition active:scale-95"
				class:bg-slate-900={!listening}
				class:bg-red-500={listening}
				class:animate-pulse={listening}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="h-8 w-8"
					aria-hidden="true"
				>
					<path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
					<path
						d="M18 11a1 1 0 1 0-2 0 4 4 0 0 1-8 0 1 1 0 1 0-2 0 6 6 0 0 0 5 5.91V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-3.09A6 6 0 0 0 18 11Z"
					/>
				</svg>
			</button>
		{/if}
	</section>

	<!-- Bottom half: Slovenian translation -->
	<section class="relative flex flex-1 flex-col bg-slate-900 px-5 pt-4 pb-5">
		<div class="flex items-center justify-between">
			<span class="text-[0.7rem] font-extrabold tracking-[0.25em] text-emerald-400/70 uppercase"
				>Slovenian</span
			>
			{#if slovenian}
				<div class="-mt-1 -mr-2"><StarButton en={english} sl={slovenian} /></div>
			{/if}
		</div>

		<div class="flex flex-1 flex-col justify-center pr-20">
			{#if errorMsg}
				<p class="text-base text-red-400">{errorMsg}</p>
			{:else if slovenian}
				<p
					class="text-[2.75rem] leading-[1.1] font-bold tracking-tight text-white transition-opacity"
					class:opacity-40={loading}
				>
					{slovenian}
				</p>
			{:else}
				<p class="text-3xl font-bold tracking-tight text-slate-700">
					{loading ? 'Translating…' : 'Prevod se pojavi tukaj'}
				</p>
			{/if}
		</div>

		{#if speech.missingVoice}
			<p class="mb-2 rounded-lg bg-amber-950/60 p-3 text-xs leading-relaxed text-amber-200">
				No Slovenian voice on this device. Install one under Settings → Accessibility → Spoken
				Content → Voices → Slovenian, then reload.
			</p>
		{/if}

		<!-- Speaker button, tucked into the bottom-right corner -->
		<button
			onclick={() => speech.speak(slovenian)}
			disabled={!slovenian}
			aria-label="Speak translation"
			class="absolute right-5 bottom-5 flex h-16 w-16 items-center justify-center rounded-full
			       bg-emerald-500 text-white shadow-lg transition active:scale-95 disabled:bg-slate-700
			       disabled:text-slate-500 disabled:shadow-none"
			class:animate-pulse={speaking}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="h-8 w-8"
				aria-hidden="true"
			>
				<path
					d="M13 4.06 8.7 7.5H5A1.5 1.5 0 0 0 3.5 9v6A1.5 1.5 0 0 0 5 16.5h3.7l4.3 3.44A1 1 0 0 0 14.5 19V5a1 1 0 0 0-1.5-.94Z"
				/>
				{#if speaking}
					<path
						d="M16.5 8.5a5 5 0 0 1 0 7M18.8 6a8 8 0 0 1 0 12"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				{/if}
			</svg>
		</button>
	</section>
</main>
