import getMatrixLine from './get-matrix-line';

function getMatrixLineWords(matrixLine) {
	const words = [];
	let word = null;

	for (let i = 0; i <= matrixLine.length; i += 1) {
		const character = matrixLine[i] || ' ';
		if (character.match(/[\t\s-_,\(\);\+\[\]\{\}:]/)) {
			if (word === null) {
				continue;
			}
			word.bounds.push(i - 1);
			words.push({...word});
			word = null;
		} else {
			if (word === null) {
				word = {
					bounds: [i],
					characters: [character],
					get length() {
						return this.characters.length;
					}
				};
				continue;
			}
			word.characters.push(character);
		}
	}

	return words;
}

function getPreviousWord(words, x) {
	const [next] = words
		.filter(word => {
			return word.length > 1 ?
				word.bounds[0] < x || word.bounds[1] <= x :
				word.bounds[0] < x || word.bounds[1] < x;
		})
		.reverse();
	return next || words[0];
}

function getNextWord(words, x) {
	const [next] = words
		.filter(word => {
			return word.length > 1 ?
				word.bounds[0] >= x || word.bounds[1] > x :
				word.bounds[0] > x || word.bounds[1] > x;
		});
	return next || words[words.length - 1];
}

export function getMatrixWord(matrix, cursor, direction = 'up') {
	const matrixLine = getMatrixLine(matrix, cursor.y);
	const matrixLineWords = getMatrixLineWords(matrixLine);

	if (matrixLineWords.length === 0) {
		return {
			bounds: [0, 0],
			characters: [],
			length: 0
		};
	}

	const word = direction === 'up' ?
		getNextWord(matrixLineWords, cursor.x) :
		getPreviousWord(matrixLineWords, cursor.x);

	return word;
}

export default getMatrixWord;
