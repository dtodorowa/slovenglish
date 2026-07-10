<script lang="ts">
	import { goto } from '$app/navigation';
	import { store, type Entry } from '$lib/store.svelte';
	import SpeakButton from '$lib/SpeakButton.svelte';
	import StarButton from '$lib/StarButton.svelte';

	let { entries }: { entries: Entry[] } = $props();

	// Load the phrase into the translator without re-translating it.
	function open(entry: Entry) {
		store.pending = entry;
		goto('/');
	}
</script>

<ul class="flex flex-col gap-1">
	{#each entries as entry (entry.ts)}
		<li class="flex items-center gap-2 rounded-2xl pr-1">
			<button
				onclick={() => open(entry)}
				class="flex min-w-0 flex-1 flex-col gap-0.5 rounded-2xl py-2 pl-3 text-left
				       transition active:bg-slate-100"
			>
				<span class="truncate text-sm text-slate-400">{entry.en}</span>
				<span class="text-lg font-bold tracking-tight text-slate-900">{entry.sl}</span>
			</button>
			<SpeakButton text={entry.sl} />
			<StarButton en={entry.en} sl={entry.sl} />
		</li>
	{/each}
</ul>
