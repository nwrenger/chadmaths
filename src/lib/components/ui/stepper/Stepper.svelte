<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Carousel from '$lib/components/ui/carousel';
	import * as Card from '$lib/components/ui/card';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import * as Pagination from '$lib/components/ui/pagination';
	import type { ButtonEventHandler } from 'bits-ui';
	import { LoaderCircle } from 'lucide-svelte';

	export let items: any[];
	export let onCheckDisabled: boolean = true;
	export let onCancel: (event: ButtonEventHandler<MouseEvent>) => void = () => {};
	export let onCheck: (event: ButtonEventHandler<MouseEvent>) => void = () => {};
	export let page: number = 1;

	export function scrollTo(index: number, jump?: boolean | undefined) {
		api?.scrollTo(index, jump);
		api = api;
		page = index + 1;
	}

	let api: CarouselAPI;
</script>

<Carousel.Root bind:api opts={{ watchDrag: false }} class="w-full">
	<Carousel.Content>
		{#each items as _, i (i)}
			<Carousel.Item>
				<div class="p-1">
					<Card.Root>
						<Card.Content class="flex items-center justify-center p-6">
							<slot {i} />
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>
		{:else}
			<Carousel.Item>
				<div class="p-1">
					<Card.Root>
						<Card.Content class="flex items-center justify-center p-6">
							<LoaderCircle scale={48} class="animate-spin" />
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Pagination.Root
		bind:page
		count={items.length}
		perPage={1}
		siblingCount={0}
		let:pages
		let:currentPage
	>
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton
					on:click={() => {
						api.scrollPrev();
						api = api;
					}}
				/>
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item class="hidden md:block">
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item class="hidden md:block">
						<Pagination.Link
							{page}
							isActive={currentPage == page.value}
							on:click={() => {
								api.scrollTo(page.value - 1);
								api = api;
							}}
						>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton
					on:click={() => {
						api.scrollNext();
						api = api;
					}}
				/>
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>
	<div class="flex flex-row justify-between p-1">
		<Button on:click={onCancel}>Cancel</Button>
		<Button on:click={onCheck} disabled={onCheckDisabled}>Check</Button>
	</div>
</Carousel.Root>
