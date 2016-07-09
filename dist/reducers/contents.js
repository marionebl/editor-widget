'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.contentsReducer = contentsReducer;

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _getMatrix = require('../utilities/get-matrix');

var _getMatrix2 = _interopRequireDefault(_getMatrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCharacterIndex(matrix, cursor) {
	var lines = matrix.slice(0, cursor.y);
	return lines.reduce(function (sum, line) {
		return sum + line.length + 1;
	}, cursor.x);
}

function contentsReducer() {
	var unsanitized = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var action = arguments[1];

	var state = unsanitized.replace(/\t/g, '  ');

	switch (action.type) {
		case _actions2.default.EDIT_DELETE:
			{
				var cursor = action.payload.cursor;
				var matrix = (0, _getMatrix2.default)(state);
				var index = getCharacterIndex(matrix, cursor);

				if (index === 0) {
					return state.slice(1);
				}

				var before = state.slice(0, index);
				var after = state.slice(index + 1);

				return before.length > 0 ? '' + before + after : state;
			}
		case _actions2.default.EDIT_INSERT:
			{
				var _action$payload = action.payload;
				var _cursor = _action$payload.cursor;
				var value = _action$payload.value;


				if (typeof value !== 'string') {
					return state;
				}

				var input = value.replace(/\t/, '  ');

				var _matrix = (0, _getMatrix2.default)(state);
				var _index = getCharacterIndex(_matrix, _cursor);

				var _before = state.slice(0, _index);
				var _after = state.slice(_index);

				return _before.length > 0 ? '' + _before + input + _after : state;
			}
		default:
			return state;
	}
}

exports.default = contentsReducer;