import {clamp} from 'lodash/fp';

import {
	EDIT_DELETE,
	EDIT_INSERT,
	EDIT_NEWLINE
} from '../actions';

import getMatrix from '../utilities/get-matrix';
import getMatrixLine from '../utilities/get-matrix-line';

const clampPositive = clamp(0);

function getCharacterIndex(matrix, x, y) {
	const lines = matrix.slice(0, y);
	const clampedX = Math.min(x, matrix[y].length);
	const column = Math.max(0, clampedX);
	return lines.reduce((sum, line) => sum + line.length + 1, column);
}

export function contentsReducer(unsanitized = '', action) {
	const state = unsanitized.replace(/\t/g, '  ');

	if (!action.payload) {
		return state;
	}

	switch (action.type) {
		case EDIT_DELETE: {
			const {cursor} = action.payload;
			const matrix = getMatrix(state);
			const index = Math.max(getCharacterIndex(matrix, cursor.x, cursor.y) - 1, 0);

			if (index === 0) {
				return state.slice(1);
			}

			const before = state.slice(0, index);
			const after = state.slice(index + 1);

			return before.length > 0 ?
				`${before}${after}` :
				state;
		}
		case EDIT_INSERT: {
			const {cursor, value} = action.payload;
			const matrix = getMatrix(state);
			const index = getCharacterIndex(matrix, cursor.x, cursor.y);

			const before = state.slice(0, Math.max(index, 0));
			const after = state.slice(Math.max(index, 0));

			return `${before}${value}${after}`;
		}
		case EDIT_NEWLINE: {
			const {cursor} = action.payload;
			const matrix = getMatrix(state);
			const index = getCharacterIndex(matrix, cursor.x, cursor.y);
			const offset = cursor.x === 0 ? -1 : 0;

			const before = state.slice(0, Math.max(index + offset, 0));
			const after = state.slice(Math.max(index + offset, 0));

			return `${before}\n${after}`;
		}
		default:
			return state;
	}
}

export default contentsReducer;
