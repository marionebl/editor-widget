'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getMatrix = getMatrix;
function getMatrix(text) {
	if (typeof text !== 'string') {
		return [''];
	}

	return text.split(/\n/g);
}

exports.default = getMatrix;