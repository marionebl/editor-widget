'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createEditorReducers = createEditorReducers;

var _cursor = require('./cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _contents = require('./contents');

var _contents2 = _interopRequireDefault(_contents);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createEditorReducers(ident) {
	var reducers = {
		gutter: function gutter() {
			var state = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			return state;
		},
		focus: function focus() {
			var state = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			return state;
		},
		highlight: function highlight() {
			var state = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			return state;
		},

		cursor: (0, _cursor2.default)(ident),
		contents: (0, _contents2.default)(ident)
	};

	return ident ? _defineProperty({}, ident, (0, _redux.combineReducers)(reducers)) : reducers;
}

exports.default = createEditorReducers;