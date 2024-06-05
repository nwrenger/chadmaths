<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	export let tabindex = 0;
	export let userAnswerOne: number | undefined | 'undefined' | string = undefined;
	export let placeholderAnswerOne: string = '';
	export let userAnswerTwo: number | undefined | 'undefined' | string = undefined;
	export let twoAnswers = false;
	export let placeholderAnswerTwo: string = '';

	let disabled = false;
</script>

<div class="{twoAnswers ? 'grid-cols-[140px_auto_auto]' : 'grid-cols-[140px_auto]'} grid gap-1">
	<Select.Root selected={{ value: 'defined', label: 'Defined' }}>
		<Select.Trigger>
			<Select.Value />
		</Select.Trigger>
		<Select.Content>
			<Select.Item
				value="defined"
				on:click={() => {
					disabled = false;
					userAnswerOne = undefined;
				}}>Defined</Select.Item
			>
			<Select.Item
				value="undefined"
				on:click={() => {
					disabled = true;
					userAnswerOne = 'undefined';
				}}>Undefined</Select.Item
			>
		</Select.Content>
	</Select.Root>
	<Input
		id="input"
		type="number"
		placeholder={placeholderAnswerOne}
		{disabled}
		{tabindex}
		bind:value={userAnswerOne}
	/>
	{#if twoAnswers}
		<Input
			id="input"
			type="number"
			placeholder={placeholderAnswerTwo}
			{disabled}
			{tabindex}
			bind:value={userAnswerTwo}
		/>
	{/if}
</div>
