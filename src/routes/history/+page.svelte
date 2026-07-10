<script lang="ts">
	import { store } from '$lib/store.svelte';
	import PhraseList from '$lib/PhraseList.svelte';
</script>

<svelte:head>
	<title>History · Slovenglish</title>
</svelte:head>

<div class="flex h-full flex-col">
	<div class="flex items-center justify-between px-5 pt-3 pb-1">
		<span class="text-[0.7rem] font-extrabold tracking-[0.25em] text-slate-400 uppercase">
			All translations
		</span>
		{#if store.history.length}
			<button
				onclick={() => store.clearHistory()}
				class="text-sm font-semibold text-slate-400 transition active:text-red-500"
			>
				Clear all
			</button>
		{/if}
	</div>

	<div class="flex-1 overflow-y-auto px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
		{#if store.history.length === 0}
			<p class="px-6 py-20 text-center leading-relaxed text-slate-400">
				Nothing yet.<br />Translations you make show up here.
			</p>
		{:else}
			<PhraseList entries={store.history} />
		{/if}
	</div>
</div>
