import {clamp} from 'lodash/fp';

import actions from '../actions';
import getMatrix from '../utilities/get-matrix';
import getMatrixLine from '../utilities/get-matrix-line';
import getMatrixWord from '../utilities/get-matrix-word';

const clampPositive = clamp(0);

export function cursor(state = {}, action) {
	const {x, y} = state;
	const {payload = {}} = action;
	const {content = '', cursor} = payload;
	const matrix = getMatrix(content);
	const matrixLine = getMatrixLine(matrix, y);

	const clampLine = clampPositive(matrix.length - 1);
	const clampColumn = clampPositive(matrixLine.length);

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
		case actions.GO_RIGHT:
			return {
				...state,
				x: clampColumn(x + 1)
			};
		case actions.GO_BACK: {
			const backY = x === 0 ? y - 1 : y;
			const backLine = getMatrixLine(matrix, backY);
			const backX = x === 0 ? backLine.length : x - 1;

			return {
				...state,
				x: backX,
				y: clampLine(backY)
			};
		}
		case actions.GO_RIGHT_WORD: {
			const word = getMatrixWord(matrix, cursor, 'up');
			const intersects = cursor.x >= word.bounds[0] && cursor.x <= word.bounds[1];
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
		case actions.GO_DOWN: {
			return {
				...state,
				y: clampLine(y + 1)
			};
		}
		case actions.GO_DOWN_INFINITY:
			return {
				...state,
				y: clampLine(Infinity)
			};
		case actions.GO_LEFT:
			return {
				...state,
				x: clampColumn(x - 1)
			};
		case actions.GO_LEFT_WORD: {
			const word = getMatrixWord(matrix, cursor, 'down');
			const intersects = cursor.x >= word.bounds[0] && cursor.x <= word.bounds[1];
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
			return state;
	}
}

export default cursor;
