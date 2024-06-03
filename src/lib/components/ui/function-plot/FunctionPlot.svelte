<script lang="ts">
	import { clamp } from '$lib';
	import type { FunctionPlotDatum } from 'function-plot';
	import { onMount } from 'svelte';
	import * as Card from '../card';
	import { LoaderCircle } from 'lucide-svelte';

	export let data: FunctionPlotDatum[] | undefined;
	export let width = 800;
	export let maxHeight = 400;
	export const id = 'plot';

	let div: HTMLDivElement;
	let loaded = false;

	async function draw(rect: any) {
		let functionPlot = (await import('function-plot')).default;

		let ratio = rect.width / width;
		let height = 500;
		width *= ratio;
		height *= ratio;
		functionPlot({
			target: `#${id}`,
			width,
			height: clamp(height, 0, maxHeight),
			tip: { yLine: true, xLine: true },
			xAxis: { label: 'x' },
			yAxis: { label: 'y' },
			grid: true,
			data
		});
	}

	onMount(async () => {
		await draw(div?.getBoundingClientRect());
		loaded = true;
	});
</script>

<svelte:window
	on:resize={async () => {
		if (div) {
			let rect = div.getBoundingClientRect();
			await draw(rect);
		}
	}}
/>

<div class="w-full p-1">
	<Card.Root>
		{#if !loaded}
			<div class="flex items-center justify-center pt-6">
				<LoaderCircle scale={48} class="animate-spin" />
			</div>
		{/if}
		<Card.Content class="flex items-center justify-center {loaded ? 'p-6' : ''}">
			<div bind:this={div} class="w-full rounded-md bg-gray-100 dark:bg-gray-800" {id} />
		</Card.Content>
	</Card.Root>
</div>
