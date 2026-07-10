<script lang="ts">
	import { store } from '$lib/store.svelte';
	import PhraseList from '$lib/PhraseList.svelte';
</script>

<svelte:head>
	<title>Starred · Slovenglish</title>
</svelte:head>

<div class="flex h-full flex-col">
	<div class="flex-1 overflow-y-auto px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
		{#if store.starred.length === 0}
			<p class="px-6 py-20 text-center leading-relaxed text-slate-400">
				No starred phrases yet.<br />Tap the ☆ on a translation to keep it here.
			</p>
		{:else}
			<PhraseList entries={store.starred} />
		{/if}
	</div>
</div>
