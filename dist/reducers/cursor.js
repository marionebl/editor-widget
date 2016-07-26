'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createCursorReducer = createCursorReducer;

var _fp = require('lodash/fp');

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _getMatrix = require('../utilities/get-matrix');

var _getMatrix2 = _interopRequireDefault(_getMatrix);

var _getMatrixLine = require('../utilities/get-matrix-line');

var _getMatrixLine2 = _interopRequireDefault(_getMatrixLine);

var _getMatrixWord = require('../utilities/get-matrix-word');

var _getMatrixWord2 = _interopRequireDefault(_getMatrixWord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clampPositive = (0, _fp.clamp)(0);

function normalizeCursorPosition(position) {
	return typeof position === 'number' && isNaN(position) === false ? position : 0;
}

function createCursorReducer(ident) {
	var actions = (0, _actions2.default)(ident);

	return function cursorReducer() {
		var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var action = arguments[1];

		if (!action.payload) {
			return state;
		}

		var x = normalizeCursorPosition(state.x);
		var y = normalizeCursorPosition(state.y);

		var _action$payload = action.payload;
		var _action$payload$conte = _action$payload.content;
		var content = _action$payload$conte === undefined ? '' : _action$payload$conte;
		var cursor = _action$payload.cursor;

		var matrix = (0, _getMatrix2.default)(content);
		var matrixLine = (0, _getMatrixLine2.default)(matrix, y);

		var clampLine = clampPositive(matrix.length - 1);
		var clampColumn = clampPositive(matrixLine.length);

		// Get the current "visible" cursor position
		var cursorLine = (0, _getMatrixLine2.default)(matrix, y);
		var clampLineCursor = clampPositive(cursorLine.length);
		var cursorX = clampLineCursor(x);

		switch (action.type) {
			case actions.GO_UP:
				{
					return _extends({}, state, {
						y: clampLine(y - 1)
					});
				}

			case actions.GO_UP_INFINITY:
				return _extends({}, state, {
					y: clampLine(-Infinity)
				});

			case actions.EDIT_DELETE:
			case actions.GO_BACK:
				{
					var backY = cursorX === 0 ? y - 1 : y;
					var backLine = (0, _getMatrixLine2.default)(matrix, backY);
					var clampColumnBack = clampPositive(backLine.length);
					var backX = cursorX === 0 ? backLine.length : x - 1;

					return _extends({}, state, {
						x: clampColumnBack(backX),
						y: clampLine(backY)
					});
				}

			case actions.EDIT_INSERT:
				return _extends({}, state, {
					x: x + 1
				});

			case actions.GO_RIGHT:
				return _extends({}, state, {
					x: clampColumn(cursorX + 1)
				});

			case actions.GO_RIGHT_WORD:
				{
					var word = (0, _getMatrixWord2.default)(matrix, cursor, 'up');
					var intersects = cursorX >= word.bounds[0] && cursorX <= word.bounds[1];
					var bound = intersects ? word.bounds[1] : word.bounds[0];
					return _extends({}, state, {
						x: clampColumn(bound)
					});
				}

			case actions.GO_RIGHT_INFINITY:
				return _extends({}, state, {
					x: clampColumn(Infinity)
				});

			case actions.EDIT_NEWLINE:
				return _extends({}, state, {
					y: y + 1,
					x: 0
				});

			case actions.GO_DOWN:
				return _extends({}, state, {
					y: clampLine(y + 1)
				});

			case actions.GO_DOWN_INFINITY:
				return _extends({}, state, {
					y: clampLine(Infinity)
				});

			case actions.GO_LEFT:
				return _extends({}, state, {
					x: clampColumn(cursorX - 1)
				});

			case actions.GO_LEFT_WORD:
				{
					var _word = (0, _getMatrixWord2.default)(matrix, cursor, 'down');
					var _intersects = cursorX >= _word.bounds[0] && cursorX <= _word.bounds[1];
					var _bound = _intersects ? _word.bounds[0] : _word.bounds[1];
					return _extends({}, state, {
						x: clampColumn(_bound)
					});
				}

			case actions.GO_LEFT_INFINITY:
				return _extends({}, state, {
					x: clampColumn(0)
				});

			default:
				return _extends({}, state, {
					x: clampColumn(x),
					y: clampLine(y)
				});
		}
	};
}

exports.default = createCursorReducer;