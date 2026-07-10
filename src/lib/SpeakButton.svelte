<script lang="ts">
	import { speech } from '$lib/speech.svelte';

	let { text }: { text: string } = $props();
	const active = $derived(!!text && speech.speakingText === text);
</script>

<button
	onclick={() => speech.speak(text)}
	aria-label="Pronounce"
	class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500
	       text-white shadow-sm transition active:scale-95"
	class:animate-pulse={active}
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
		<path
			d="M13 4.06 8.7 7.5H5A1.5 1.5 0 0 0 3.5 9v6A1.5 1.5 0 0 0 5 16.5h3.7l4.3 3.44A1 1 0 0 0 14.5 19V5a1 1 0 0 0-1.5-.94Z"
		/>
		{#if active}
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
