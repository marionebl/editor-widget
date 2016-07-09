'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getMatrixCharacter = getMatrixCharacter;
function getMatrixCharacter(matrix, cursor) {
	var x = cursor.x;
	var y = cursor.y;

	var line = matrix[y];

	if (!line) {
		return '';
	}
	return line[x] || '';
}

exports.default = getMatrixCharacter;