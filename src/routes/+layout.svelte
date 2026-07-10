<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { speech } from '$lib/speech.svelte';
	import { store } from '$lib/store.svelte';

	let { children } = $props();

	onMount(() => speech.init());

	const path = $derived(page.url.pathname);
	const isSubpage = $derived(path !== '/');
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex h-dvh flex-col bg-white">
	<div class="min-h-0 flex-1 overflow-hidden">
		{@render children()}
	</div>

	<!-- Always-visible bottom bar, styled as an extension of the dark Slovenian
	     panel. On the translator it holds the Starred/History pills; on a subpage
	     it collapses to a single Back control. -->
	<nav
		class="flex items-center justify-center gap-2 bg-slate-900 px-4 pt-2.5
		       pb-[max(0.625rem,env(safe-area-inset-bottom))] text-sm font-semibold"
	>
		{#if isSubpage}
			<a
				href="/"
				aria-label="Back to translator"
				class="inline-flex items-center gap-1 rounded-full py-1.5 pr-5 pl-4 text-slate-200
				       transition active:scale-95 active:bg-slate-800"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5"
					aria-hidden="true"
				>
					<path d="M15 5 8 12l7 7" />
				</svg>
				Translate
			</a>
		{:else}
			<a
				href="/starred"
				class="inline-flex items-center rounded-full px-5 py-1.5 text-slate-300
				       transition active:scale-95 active:bg-slate-800"
			>
				<span>Starred</span>
				{#if store.starred.length}
					<span
						class="ml-1.5 rounded-full bg-amber-400 px-1.5 text-xs font-bold tabular-nums text-slate-900"
						>{store.starred.length}</span
					>
				{/if}
			</a>
			<a
				href="/history"
				class="rounded-full px-5 py-1.5 text-slate-300 transition active:scale-95 active:bg-slate-800"
			>
				History
			</a>
		{/if}
	</nav>
</div>
