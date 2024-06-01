// Get random Integer in Range function, js doesn't have a native function for that...
export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// gives back the question count with a specified difficulty
export function difCount(dif: number): number {
	switch (dif) {
		case 1:
			return 4;
		case 2:
			return 4;
		case 3:
			return 5;
		case 4:
			return 6;
		default:
			return 4;
	}
}

/// A clamp function
export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}
