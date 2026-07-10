<script lang="ts">
	import { store } from '$lib/store.svelte';

	let { en, sl }: { en: string; sl: string } = $props();
	const on = $derived(store.isStarred(en, sl));
</script>

<button
	onclick={() => store.toggleStar(en, sl, Date.now())}
	aria-label={on ? 'Remove star' : 'Star'}
	aria-pressed={on}
	class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-95"
	class:text-amber-400={on}
	class:text-slate-300={!on}
>
	<svg
		viewBox="0 0 24 24"
		class="h-6 w-6"
		fill={on ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="2"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5L2.6 9.8l6.5-.9z" />
	</svg>
</button>
