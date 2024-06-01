<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { onMount } from 'svelte';
	import Stepper from '../../lib/components/ui/stepper/Stepper.svelte';
	import { page } from '$app/stores';
	import { difCount, getRandomInt } from '$lib';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	interface MentalQuest {
		question: string;
		answer: number;
		userInput?: string;
		invalid?: string;
		givenUp?: boolean;
	}

	let difficulty: number = 1;
	let quests: MentalQuest[] = [];
	let stepperPage: number;
	let stepper: Stepper;
	let wrongDialog = false;
	let correctDialog = false;

	onMount(() => {
		difficulty = parseInt($page.url.searchParams.get('dif') || '1');
		let count = difCount(difficulty);

		for (let i = 1; i < count + 1; i++) {
			let a = getRandomInt(0, 500 * difficulty);
			let b = getRandomInt(0, 500 * difficulty);
			let type = getRandomInt(0, 5);
			let question = '';
			let answer = 0;
			switch (type) {
				case 0:
					while (quests.find((quest) => quest.answer == a + b)) {
						a = getRandomInt(0, 500 * difficulty);
						b = getRandomInt(0, 500 * difficulty);
					}
					question = `${a} + ${b}`;
					answer = a + b;
					break;
				case 1:
					while (quests.find((quest) => quest.answer == a - b)) {
						a = getRandomInt(0, 500 * difficulty);
						b = getRandomInt(0, 500 * difficulty);
					}
					question = `${a} - ${b}`;
					answer = a - b;
					break;
				case 2:
					a = getRandomInt(0, 100 * difficulty);
					b = getRandomInt(0, 20 * difficulty);
					while (quests.find((quest) => quest.answer == a * b)) {
						a = getRandomInt(0, 100 * difficulty);
						b = getRandomInt(0, 20 * difficulty);
					}
					question = `${a} * ${b}`;
					answer = a * b;
					break;
				case 3:
					while (a % b !== 0 || a / b === 1 || quests.find((quest) => quest.answer == a / b)) {
						a = getRandomInt(2, 500 * difficulty);
						b = getRandomInt(2, 500 * difficulty);
					}
					question = `${a} / ${b}`;
					answer = a / b;
					break;
				case 4:
					a = getRandomInt(2 * difficulty, 6 * difficulty);
					b = getRandomInt(2, difficulty > 1 ? (difficulty > 3 ? 4 : 3) : 2);
					while (quests.find((quest) => quest.answer == a ** b)) {
						a = getRandomInt(2 * difficulty, 6 * difficulty);
						b = getRandomInt(2, difficulty > 1 ? (difficulty > 3 ? 4 : 3) : 2);
					}
					question = `${a} ^ ${b}`;
					answer = a ** b;
					break;
				case 5:
					a = getRandomInt(2 * difficulty, 12 * difficulty);
					while (quests.find((quest) => quest.answer == Math.sqrt(a ** 2))) {
						a = getRandomInt(2 * difficulty, 12 * difficulty);
					}
					question = `√${a ** 2}`;
					answer = Math.sqrt(a ** 2);
					break;
				default:
					break;
			}
			quests.push({ question, answer });
		}
		quests = quests;
	});

	function checkAnswers(): boolean {
		let correct = true;
		for (const [i, quest] of quests.entries()) {
			let userInput: number = parseInt(quest?.userInput || '');
			if (userInput !== quest.answer) {
				if (correct) {
					stepper?.scrollTo(i);
				}
				correct = false;
				if (userInput > quest.answer) {
					quest.invalid = 'smaller';
				} else if (userInput < quest.answer) {
					quest.invalid = 'bigger';
				} else {
					quest.invalid = 'idk, wrong input';
				}
			} else {
				quest.invalid = 'ok';
			}
		}
		quests = quests;
		return correct;
	}
</script>

<svelte:head>
	<title>Mental Calculus</title>
	<meta name="description" content="Calculations using your MIND!" />
</svelte:head>

<AlertDialog.Root bind:open={wrongDialog} onOpenChange={(value) => (wrongDialog = value)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Retry!</AlertDialog.Title>
			<AlertDialog.Description>
				You did {quests.filter((quest) => quest.invalid !== 'ok').length} wrong! Please retry!
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action>Ok</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={correctDialog} onOpenChange={(value) => (correctDialog = value)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Congratulations!</AlertDialog.Title>
			<AlertDialog.Description>You answered all questions correctly!</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
			<AlertDialog.Action on:click={() => goto(`/?dif=${difficulty || ''}&mode=mental`)}
				>Ok</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<Stepper
	bind:this={stepper}
	bind:items={quests}
	bind:page={stepperPage}
	let:i
	onCancel={() => goto(`/?dif=${difficulty || ''}&mode=mental`)}
	onCheck={() => {
		if (checkAnswers()) {
			correctDialog = true;
		} else {
			wrongDialog = true;
		}
	}}
	onCheckDisabled={!quests.every((quest) => quest.userInput)}
>
	<div class="w-full space-y-1">
		<Label for="input" class="text-right"
			><span class="text-xl font-semibold">{i + 1}. What is {quests[i].question}?</span></Label
		>
		<Input
			id="input"
			type="number"
			placeholder="Input Answer..."
			tabindex={stepperPage - 1 == i ? 0 : -1}
			bind:value={quests[i].userInput}
		/>
		{#if quests[i].invalid}
			{#if quests[i].invalid !== 'ok'}
				<div class="flex flex-row items-center justify-between pt-2">
					<p class="text-destructive">
						Wrong, The correct value would be {quests[i].givenUp
							? quests[i].answer
							: quests[i].invalid}!
					</p>
					{#if !quests[i].givenUp}
						<Button
							tabindex={stepperPage - 1 == i ? 0 : -1}
							on:click={() => (quests[i].givenUp = true)}>Reveal answer</Button
						>
					{/if}
				</div>
			{:else}
				<p class="text-green-500">Looks good!</p>
			{/if}
		{/if}
	</div>
</Stepper>
