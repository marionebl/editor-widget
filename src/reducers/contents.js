import actions from '../actions';
import getMatrix from '../utilities/get-matrix';

function getCharacterIndex(matrix, cursor) {
	const column = Math.max(cursor.x, 0);
	const lines = matrix.slice(0, cursor.y);
	return lines.reduce((sum, line) => sum + line.length + 1, column);
}

export function contentsReducer(state = '', action) {
	switch (action.type) {
		case actions.EDIT_DELETE: {
			const {cursor, content} = action.payload;
			const matrix = getMatrix(content);
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
		case actions.EDIT_INSERT:
		default:
			return state;
	}
}

export default contentsReducer;
