import actions from '../actions';
import getMatrix from '../utilities/get-matrix';

function getCharacterIndex(matrix, cursor) {
	const lines = matrix.slice(0, cursor.y);
	return lines.reduce((sum, line) => sum + line.length + 1, cursor.x);
}

export function contentsReducer(unsanitized = '', action) {
	const state = unsanitized.replace(/\t/g, '  ');

	switch (action.type) {
		case actions.EDIT_DELETE: {
			const cursor = action.payload.cursor;
			const matrix = getMatrix(state);
			const index = getCharacterIndex(matrix, cursor);

			if (index === 0) {
				return state.slice(1);
			}

			const before = state.slice(0, index);
			const after = state.slice(index + 1);

			return before.length > 0 ?
				`${before}${after}` :
				state;
		}
		case actions.EDIT_INSERT: {
			const {cursor, value} = action.payload;

			if (typeof value !== 'string') {
				return state;
			}

			const input = value.replace(/\t/, '  ');

			const matrix = getMatrix(state);
			const index = getCharacterIndex(matrix, cursor);

			const before = state.slice(0, index);
			const after = state.slice(index);

			return before.length > 0 ?
				`${before}${input}${after}` :
				state;
		}
		default:
			return state;
	}
}

export default contentsReducer;
