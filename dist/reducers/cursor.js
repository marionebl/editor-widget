'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.cursor = cursor;

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

function cursor() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];
	var x = state.x;
	var y = state.y;
	var _action$payload = action.payload;
	var payload = _action$payload === undefined ? {} : _action$payload;
	var _payload$content = payload.content;
	var content = _payload$content === undefined ? '' : _payload$content;
	var cursor = payload.cursor;

	var matrix = (0, _getMatrix2.default)(content);
	var matrixLine = (0, _getMatrixLine2.default)(matrix, y);

	var clampLine = clampPositive(matrix.length - 1);
	var clampColumn = clampPositive(matrixLine.length);

	switch (action.type) {
		case _actions2.default.GO_UP:
			{
				return _extends({}, state, {
					y: clampLine(y - 1)
				});
			}
		case _actions2.default.GO_UP_INFINITY:
			return _extends({}, state, {
				y: clampLine(-Infinity)
			});
		case _actions2.default.GO_RIGHT:
			return _extends({}, state, {
				x: clampColumn(x + 1)
			});
		case _actions2.default.GO_BACK:
			{
				var backY = x === 0 ? y - 1 : y;
				var backLine = (0, _getMatrixLine2.default)(matrix, backY);
				var backX = x === 0 ? backLine.length : x - 1;

				return _extends({}, state, {
					x: backX,
					y: clampLine(backY)
				});
			}
		case _actions2.default.GO_RIGHT_WORD:
			{
				var word = (0, _getMatrixWord2.default)(matrix, cursor, 'up');
				var intersects = cursor.x >= word.bounds[0] && cursor.x <= word.bounds[1];
				var bound = intersects ? word.bounds[1] : word.bounds[0];
				return _extends({}, state, {
					x: clampColumn(bound)
				});
			}
		case _actions2.default.GO_RIGHT_INFINITY:
			return _extends({}, state, {
				x: clampColumn(Infinity)
			});
		case _actions2.default.GO_DOWN:
			{
				return _extends({}, state, {
					y: clampLine(y + 1)
				});
			}
		case _actions2.default.GO_DOWN_INFINITY:
			return _extends({}, state, {
				y: clampLine(Infinity)
			});
		case _actions2.default.GO_LEFT:
			return _extends({}, state, {
				x: clampColumn(x - 1)
			});
		case _actions2.default.GO_LEFT_WORD:
			{
				var _word = (0, _getMatrixWord2.default)(matrix, cursor, 'down');
				var _intersects = cursor.x >= _word.bounds[0] && cursor.x <= _word.bounds[1];
				var _bound = _intersects ? _word.bounds[0] : _word.bounds[1];
				return _extends({}, state, {
					x: clampColumn(_bound)
				});
			}
		case _actions2.default.GO_LEFT_INFINITY:
			return _extends({}, state, {
				x: clampColumn(0)
			});
		default:
			return state;
	}
}

exports.default = cursor;