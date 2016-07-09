'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getMatrixLine = getMatrixLine;
function getMatrixLine(matrix, index) {
	return matrix[index] || '';
}

exports.default = getMatrixLine;