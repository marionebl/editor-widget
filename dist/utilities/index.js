'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.plus = exports.minus = undefined;

var _minus = require('./minus');

var _minus2 = _interopRequireDefault(_minus);

var _plus = require('./plus');

var _plus2 = _interopRequireDefault(_plus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.minus = _minus2.default;
exports.plus = _plus2.default;
exports.default = {
	minus: _minus2.default,
	plus: _plus2.default
};