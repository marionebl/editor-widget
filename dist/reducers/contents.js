'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createContentsReducer = createContentsReducer;

var _getMatrix = require('../utilities/get-matrix');

var _getMatrix2 = _interopRequireDefault(_getMatrix);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCharacterIndex(matrix, x, y) {
	var lines = matrix.slice(0, y);
	var clampedX = Math.min(x, matrix[y].length);
	var column = Math.max(0, clampedX);
	return lines.reduce(function (sum, line) {
		return sum + line.length + 1;
	}, column);
}

function sanitize(value) {
	// TODO: handle tabs properly
	return value.replace(/\t/g, '  ');
}

function createContentsReducer(ident) {
	var actions = (0, _actions2.default)(ident);

	return function contentsReducer() {
		var unsanitized = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
		var action = arguments[1];

		var state = sanitize(unsanitized);

		if (!action.payload) {
			return state;
		}

		switch (action.type) {
			case actions.EDIT_DELETE:
				{
					var cursor = action.payload.cursor;

					var matrix = (0, _getMatrix2.default)(state);
					var index = Math.max(getCharacterIndex(matrix, cursor.x, cursor.y) - 1, 0);

					if (index === 0) {
						return state.slice(1);
					}

					var before = state.slice(0, index);
					var after = state.slice(index + 1);

					return before.length > 0 ? '' + before + after : state;
				}
			case actions.EDIT_INSERT:
				{
					var _action$payload = action.payload;
					var _cursor = _action$payload.cursor;
					var _action$payload$value = _action$payload.value;
					var value = _action$payload$value === undefined ? '' : _action$payload$value;

					var sanitized = sanitize(value);
					var _matrix = (0, _getMatrix2.default)(state);
					var _index = getCharacterIndex(_matrix, _cursor.x, _cursor.y);

					var _before = state.slice(0, Math.max(_index, 0));
					var _after = state.slice(Math.max(_index, 0));

					return '' + _before + sanitized + _after;
				}
			case actions.EDIT_NEWLINE:
				{
					var _cursor2 = action.payload.cursor;

					var _matrix2 = (0, _getMatrix2.default)(state);
					var _index2 = getCharacterIndex(_matrix2, _cursor2.x, _cursor2.y);
					var offset = _cursor2.x === 0 ? -1 : 0;

					var _before2 = state.slice(0, Math.max(_index2 + offset, 0));
					var _after2 = state.slice(Math.max(_index2 + offset, 0));

					return _before2 + '\n' + _after2;
				}
			default:
				return state;
		}
	};
}

exports.default = createContentsReducer;