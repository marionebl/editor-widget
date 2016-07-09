"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.plus = plus;
function plus(offset) {
	return function (index) {
		return index + offset + 1;
	};
}

exports.default = plus;