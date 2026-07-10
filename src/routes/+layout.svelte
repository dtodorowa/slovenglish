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
	<header
		class="flex items-center justify-between border-b border-slate-100
		       px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2"
	>
		{#if isSubpage}
			<a
				href="/"
				aria-label="Back to translator"
				class="-ml-2 inline-flex items-center gap-1 rounded-full py-1 pr-3 pl-2 text-sm
				       font-semibold text-slate-900 transition active:scale-95 active:bg-slate-100"
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
				Back
			</a>
		{:else}
			<!-- No logo: in an installed app the OS already names it. Empty spacer
			     keeps the nav pushed to the right via justify-between. -->
			<span aria-hidden="true"></span>
		{/if}

		<nav class="flex items-center gap-1 text-sm font-semibold">
			<a
				href="/starred"
				class="inline-flex items-center rounded-full px-3 py-1 transition"
				class:bg-amber-100={path === '/starred'}
				class:text-amber-700={path === '/starred'}
				class:text-slate-400={path !== '/starred'}
			>
				<span>Starred</span>
				{#if store.starred.length}
					<span
						class="ml-1.5 rounded-full bg-amber-200 px-1.5 text-xs font-bold tabular-nums text-amber-800"
						>{store.starred.length}</span
					>
				{/if}
			</a>
			<a
				href="/history"
				class="rounded-full px-3 py-1 transition"
				class:bg-slate-900={path === '/history'}
				class:text-white={path === '/history'}
				class:text-slate-400={path !== '/history'}
			>
				History
			</a>
		</nav>
	</header>

	<div class="min-h-0 flex-1 overflow-hidden">
		{@render children()}
	</div>
</div>
