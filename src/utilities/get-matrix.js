export function getMatrix(text) {
	if (typeof text !== 'string') {
		return [''];
	}

	return text.split(/\n/g);
}

export default getMatrix;
