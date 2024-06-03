<script lang="ts">
	import Stepper from '../../lib/components/ui/stepper/Stepper.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { arraysEqual, getRandomInt } from '$lib';
	import FunctionPlot from '$lib/components/ui/function-plot/FunctionPlot.svelte';
	import PointInput from './PointInput.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	interface Graph {
		fn: string;
		questions: GraphQuest[];
	}

	type Answer = 'undefined'[] | number[];

	interface GraphQuest {
		question: Quest;
		answers: Answer;
		userAnswer: Answer;
		invalid?: string;
		givenUp?: boolean;
	}

	interface Quest {
		string: string;
		type: QuestType;
	}

	enum QuestType {
		Ascent,
		X,
		Y,
		TwoX,
		Interval,
		Point,
		Points
	}

	let difficulty: number = 1;
	let graph: Graph = { fn: '', questions: [] };
	let stepperPage: number;
	let stepper: Stepper;
	let wrongDialog = false;
	let correctDialog = false;

	onMount(() => {
		difficulty = parseInt($page.url.searchParams.get('dif') || '1');
		let a = getRandomInt(-2, 2);
		let b = getRandomInt(2, 3);
		let c = getRandomInt(-5, 5);

		switch (difficulty) {
			case 1:
				graph.fn = `${a} * x + ${c}`;
				graph.questions.push({
					question: { string: 'What is the Ascent', type: QuestType.Ascent },
					answers: [a],
					userAnswer: []
				});
				graph.questions.push({
					question: { string: 'Where is the Y Axial intercept (f(0))', type: QuestType.Y },
					answers: [c],
					userAnswer: []
				});
				graph.questions.push({
					question: { string: 'Where is the X Axial intercept (f(x) = 0)', type: QuestType.X },
					answers: 0 !== a ? [-c / a] : ['undefined'],
					userAnswer: []
				});
				break;
			case 2:
				graph.fn = `${a} * (x - ${b}) ^ 2 + ${c}`;
				graph.questions.push({
					question: { string: 'Where is the Extreme Point', type: QuestType.Point },
					answers: [b, c],
					userAnswer: []
				});
				graph.questions.push({
					question: { string: 'Where is the Y Axial intercept (f(0) = ?)', type: QuestType.Y },
					answers: [a * (-b) ** 2 + c],
					userAnswer: []
				});
				let root = Math.sqrt(-(c / a)) || undefined;
				graph.questions.push({
					question: { string: 'Where are the X Axial intercepts (f(?) = 0)', type: QuestType.TwoX },
					answers: 0 !== a && root ? [b + root, b - root] : ['undefined'],
					userAnswer: []
				});
				graph.questions.push({
					question: { string: 'What is the Ascent', type: QuestType.Ascent },
					answers: [a],
					userAnswer: []
				});
				break;
			case 3:
				graph.fn = `${a} * x ^ ${b + 1} + x ^ ${b} + ${c}`;
				// 			quests.push({
				// 				points: points(f),
				// 				question: 'What are the Turning/Saddle Points',
				// 				answers: undefined
				// 			});
				// 			quests.push({
				// 				points: points(f),
				// 				question: 'Where is an Interval in which x grows positively',
				// 				answers: undefined
				// 			});
				break;
			// todo
			case 4:
				graph.fn = `${a} * x ^ ${b + 1} - x ^ ${b} + ${c}`;
				break;
			// todo
		}
		graph = graph;
	});

	function checkAnswers(): boolean {
		let correct = true;
		for (const [i, quest] of graph.questions.entries()) {
			quest.userAnswer.forEach((answer, index) => {
				if (answer !== 'undefined') {
					quest.userAnswer[index] = parseFloat(answer.toString() || '');
				}
			});
			if (!arraysEqual(quest.userAnswer, quest.answers)) {
				if (correct) {
					stepper?.scrollTo(i);
				}
				correct = false;
				quest.invalid = 'Check if you jangled up somethings';
				// todo tips
			} else {
				quest.invalid = 'ok';
			}
		}
		graph = graph;
		return correct;
	}
</script>

<svelte:head>
	<title>Graphs & Analysis</title>
	<meta name="description" content="Graphs & Analysis using your EYES!" />
</svelte:head>

<AlertDialog.Root bind:open={wrongDialog} onOpenChange={(value) => (wrongDialog = value)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Retry!</AlertDialog.Title>
			<AlertDialog.Description>
				You did {graph.questions.filter((quest) => quest.invalid !== 'ok').length} wrong! Please retry!
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

<FunctionPlot data={[{ fn: graph.fn }]} maxHeight={300} />

<Stepper
	bind:this={stepper}
	bind:items={graph.questions}
	bind:page={stepperPage}
	let:i
	onCancel={() => goto(`/?dif=${difficulty || ''}&mode=graphs`)}
	onCheck={() => {
		console.log(graph.questions);
		if (checkAnswers()) {
			correctDialog = true;
		} else {
			wrongDialog = true;
		}
	}}
	onCheckDisabled={!graph.questions.every((quest) => quest.userAnswer.length > 0)}
>
	<div class="w-full space-y-1">
		<h1 class="text-xl font-semibold">{i + 1}. {graph.questions[i].question.string}?</h1>
		{#if graph.questions[i].question.type == QuestType.Ascent || graph.questions[i].question.type == QuestType.X || graph.questions[i].question.type == QuestType.Y}
			<PointInput
				placeholderAnswerOne="Input Answer..."
				tabindex={stepperPage - 1 == i ? 0 : -1}
				bind:userAnswerOne={graph.questions[i].userAnswer[0]}
			/>
		{:else if graph.questions[i] && graph.questions[i].question.type == QuestType.TwoX}
			<PointInput
				twoAnswers
				placeholderAnswerOne="Input 1. X..."
				placeholderAnswerTwo="Input 2. X..."
				tabindex={stepperPage - 1 == i ? 0 : -1}
				bind:userAnswerOne={graph.questions[i].userAnswer[0]}
				bind:userAnswerTwo={graph.questions[i].userAnswer[1]}
			/>
		{:else if graph.questions[i] && graph.questions[i].question.type == QuestType.Point}
			<PointInput
				twoAnswers
				placeholderAnswerOne="Input X..."
				placeholderAnswerTwo="Input Y..."
				tabindex={stepperPage - 1 == i ? 0 : -1}
				bind:userAnswerOne={graph.questions[i].userAnswer[0]}
				bind:userAnswerTwo={graph.questions[i].userAnswer[1]}
			/>
		{/if}
		{#if graph.questions[i].invalid}
			{#if graph.questions[i].invalid !== 'ok'}
				<div class="flex flex-row items-center justify-between pt-2">
					<p class="text-destructive">
						Wrong! {graph.questions[i].givenUp
							? 'Correct would be ' + graph.questions[i].answers
							: graph.questions[i].invalid}!
					</p>
					{#if !graph.questions[i].givenUp}
						<Button
							tabindex={stepperPage - 1 == i ? 0 : -1}
							on:click={() => (graph.questions[i].givenUp = true)}>Reveal answer</Button
						>
					{/if}
				</div>
			{:else}
				<p class="text-green-500">Looks good!</p>
			{/if}
		{/if}
	</div>
</Stepper>
