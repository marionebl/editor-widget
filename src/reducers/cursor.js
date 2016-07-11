import {clamp} from 'lodash/fp';

import actions from '../actions';
import getMatrix from '../utilities/get-matrix';
import getMatrixLine from '../utilities/get-matrix-line';
import getMatrixWord from '../utilities/get-matrix-word';

const clampPositive = clamp(0);

export function cursor(state = {}, action) {
	if (!action.payload) {
		return state;
	}

	const {x, y} = state;
	const {content = '', cursor} = action.payload;
	const matrix = getMatrix(content);
	const matrixLine = getMatrixLine(matrix, y);

	const clampLine = clampPositive(matrix.length - 1);
	const clampColumn = clampPositive(matrixLine.length);

	// Get the current "visible" cursor position
	const cursorLine = getMatrixLine(matrix, y);
	const clampLineCursor = clampPositive(cursorLine.length);
	const cursorX = clampLineCursor(x);

	switch (action.type) {
		case actions.GO_UP: {
			return {
				...state,
				y: clampLine(y - 1)
			};
		}

		case actions.GO_UP_INFINITY:
			return {
				...state,
				y: clampLine(-Infinity)
			};

		case actions.EDIT_DELETE:
		case actions.GO_BACK: {
			const backY = cursorX === 0 ? y - 1 : y;
			const backLine = getMatrixLine(matrix, backY);
			const clampColumnBack = clampPositive(backLine.length);
			const backX = cursorX === 0 ? backLine.length : x - 1;

			return {
				...state,
				x: clampColumnBack(backX),
				y: clampLine(backY)
			};
		}

		case actions.EDIT_INSERT:
			return {
				...state,
				x: x + 1
			};

		case actions.GO_RIGHT:
			return {
				...state,
				x: clampColumn(cursorX + 1)
			};

		case actions.GO_RIGHT_WORD: {
			const word = getMatrixWord(matrix, cursor, 'up');
			const intersects = cursorX >= word.bounds[0] && cursorX <= word.bounds[1];
			const bound = intersects ? word.bounds[1] : word.bounds[0];
			return {
				...state,
				x: clampColumn(bound)
			};
		}

		case actions.GO_RIGHT_INFINITY:
			return {
				...state,
				x: clampColumn(Infinity)
			};

		case actions.EDIT_NEWLINE:
			return {
				...state,
				y: y + 1,
				x: 0
			};

		case actions.GO_DOWN:
			return {
				...state,
				y: clampLine(y + 1)
			};

		case actions.GO_DOWN_INFINITY:
			return {
				...state,
				y: clampLine(Infinity)
			};

		case actions.GO_LEFT:
			return {
				...state,
				x: clampColumn(cursorX - 1)
			};

		case actions.GO_LEFT_WORD: {
			const word = getMatrixWord(matrix, cursor, 'down');
			const intersects = cursorX >= word.bounds[0] && cursorX <= word.bounds[1];
			const bound = intersects ? word.bounds[0] : word.bounds[1];
			return {
				...state,
				x: clampColumn(bound)
			};
		}

		case actions.GO_LEFT_INFINITY:
			return {
				...state,
				x: clampColumn(0)
			};

		default:
			return {
				...state,
				x: clampColumn(x),
				y: clampLine(y)
			};
	}
}

export default cursor;
