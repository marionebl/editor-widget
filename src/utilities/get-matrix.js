export function getMatrix(text) {
	if (typeof text !== 'string') {
		return [];
	}

	const sanitized = text.replace(/\t/g, '    ');
	return sanitized.split('\n').map(line => line.split(''));
}

export default getMatrix;
