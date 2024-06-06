<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import type { Selected } from 'bits-ui';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mode: Selected<string>;
	let difficulty: Selected<number>;

	function fromValToLabel(value: string | number): string {
		switch (value) {
			case 1:
				return 'Easy';
			case 2:
				return 'Medium';
			case 3:
				return 'Hard';
			case 4:
				return 'Unbeatable';
			case 'mental':
				return 'Mental Calculus';
			case 'graphs':
				return 'Graphs';
			default:
				return '';
		}
	}

	onMount(() => {
		let modeValue = $page.url.searchParams.get('mode');
		if (modeValue) {
			mode = {
				value: modeValue,
				label: fromValToLabel(modeValue)
			};
		}
		let difficultyValue = $page.url.searchParams.get('dif');
		if (difficultyValue) {
			difficulty = {
				value: parseInt(difficultyValue),
				label: fromValToLabel(parseInt(difficultyValue))
			};
		}
	});
</script>

<svelte:head>
	<title>chadmaths</title>
	<meta name="description" content="Start your journey with chadmaths." />
</svelte:head>

<div class="text-center">
	<h1 class="pb-2 text-4xl font-semibold">chadmaths</h1>
	<p>
		Quick, intuitive, and immensely fun, chadmaths makes learning math a dynamic and rewarding
		experience. Start mastering math the exciting way today!
	</p>
</div>

<p class="text-center">Select you desired mode and difficulty to practice down below!</p>

<div class="flex flex-row gap-1">
	<Select.Root bind:selected={mode}>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Modes" />
		</Select.Trigger>
		<Select.Content>
			<Select.Item value="mental">Mental Calculus</Select.Item>
			<Select.Item value="graphs">Graphs</Select.Item>
		</Select.Content>
	</Select.Root>
	<Select.Root bind:selected={difficulty}>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Difficulty" />
		</Select.Trigger>
		<Select.Content>
			<Select.Item value={1}>Easy</Select.Item>
			<Select.Item value={2}>Medium</Select.Item>
			<Select.Item value={3}>Hard</Select.Item>
			<Select.Item value={4}>Unbeatable</Select.Item>
		</Select.Content>
	</Select.Root>
</div>

<Button
	disabled={!(mode && difficulty)}
	on:click={() => {
		goto(`/${mode?.value || ''}?dif=${difficulty?.value || 0}`);
	}}>Start</Button
>
