<script lang="ts">
	import Stepper from '../../lib/components/ui/stepper/Stepper.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getRandomInt } from '$lib';
	import FunctionPlot from '$lib/components/ui/function-plot/FunctionPlot.svelte';
	import { Input } from '$lib/components/ui/input';

	interface Graph {
		fn: string;
		questions: GraphQuest[];
	}

	type Answer = 'undefined' | number[];

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
					answers: 0 !== a ? [-c / a] : 'undefined',
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
					answers: 0 !== a && root ? [b + root, b - root] : 'undefined',
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
				graph.fn = `${a} * x ^ ${b + 1} + x ^ ${b} + ${c}`;
				break;
			// todo
		}
		graph = graph;
	});
</script>

<svelte:head>
	<title>Graphs & Analysis</title>
	<meta name="description" content="Graphs & Analysis using your EYES!" />
</svelte:head>

<FunctionPlot data={[{ fn: graph.fn }]} maxHeight={300} />

<Stepper
	bind:items={graph.questions}
	bind:page={stepperPage}
	let:i
	onCancel={() => goto(`/?dif=${difficulty || ''}&mode=graphs`)}
	onCheck={() => {
		console.log(graph.questions);
	}}
	onCheckDisabled={!graph.questions.every((quest) => quest.userAnswer.length > 0)}
>
	<div class="flex w-full flex-col">
		<h1 class="text-xl font-semibold">{i + 1}. {graph.questions[i].question.string}?</h1>
		{#if graph.questions[i].question.type == QuestType.Ascent || graph.questions[i].question.type == QuestType.X || graph.questions[i].question.type == QuestType.Y}
			<Input
				id="input"
				placeholder="Input Answer..."
				type="number"
				tabindex={stepperPage - 1 == i ? 0 : -1}
				bind:value={graph.questions[i].userAnswer[0]}
			/>
		{:else if graph.questions[i] && graph.questions[i].question.type == QuestType.TwoX}
			<div class="grid grid-cols-2 gap-1">
				<Input
					id="input"
					type="number"
					placeholder="Input 1. X..."
					tabindex={stepperPage - 1 == i ? 0 : -1}
					bind:value={graph.questions[i].userAnswer[0]}
				/>
				<Input
					id="input"
					type="number"
					placeholder="Input 2. X..."
					tabindex={stepperPage - 1 == i ? 0 : -1}
					bind:value={graph.questions[i].userAnswer[1]}
				/>
			</div>
		{:else if graph.questions[i] && graph.questions[i].question.type == QuestType.Point}
			<div class="grid grid-cols-2 gap-1">
				<Input
					id="input"
					type="number"
					placeholder="Input X..."
					tabindex={stepperPage - 1 == i ? 0 : -1}
					bind:value={graph.questions[i].userAnswer[0]}
				/>
				<Input
					id="input"
					type="number"
					placeholder="Input Y..."
					tabindex={stepperPage - 1 == i ? 0 : -1}
					bind:value={graph.questions[i].userAnswer[1]}
				/>
			</div>
		{/if}
		<p>{JSON.stringify(graph.questions[i].answers)}</p>
	</div>
</Stepper>
