'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _cursor = require('./cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _contents = require('./contents');

var _contents2 = _interopRequireDefault(_contents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	gutter: function gutter() {
		var state = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

		return state;
	},
	focus: function focus() {
		var state = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

		return state;
	},

	cursor: _cursor2.default,
	contents: _contents2.default
};