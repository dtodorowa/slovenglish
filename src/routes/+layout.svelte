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
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex h-dvh flex-col bg-white">
	<header
		class="flex items-center justify-between border-b border-slate-100
		       px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2"
	>
		<a href="/" class="text-sm font-extrabold tracking-tight text-slate-900">Slovenglish</a>

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
