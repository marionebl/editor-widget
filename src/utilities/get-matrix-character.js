export function getMatrixCharacter(matrix, cursor) {
	const {x, y} = cursor;
	const line = matrix[y];

	if (!line) {
		return '';
	}
	return line[x] || '';
}

export default getMatrixCharacter;
