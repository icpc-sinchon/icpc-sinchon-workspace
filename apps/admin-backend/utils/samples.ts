function powersOfTwo(n: number) {
	return [...Array(n + 1)].map((_, i) => 2 ** i);
}

export { powersOfTwo };
