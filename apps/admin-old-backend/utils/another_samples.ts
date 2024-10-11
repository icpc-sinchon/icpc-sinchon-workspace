const squares = (n: number) => {
	return [...Array(n + 1)].map((_, i) => i ** 2);
};

export { squares };
