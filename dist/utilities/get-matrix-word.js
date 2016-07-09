'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getMatrixWord = getMatrixWord;

var _getMatrixLine = require('./get-matrix-line');

var _getMatrixLine2 = _interopRequireDefault(_getMatrixLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getMatrixLineWords(matrixLine) {
	var words = [];
	var word = null;

	for (var i = 0; i <= matrixLine.length; i += 1) {
		var character = matrixLine[i] || ' ';
		if (character.match(/[\t\s-_,\(\);\+\[\]\{\}:]/)) {
			if (word === null) {
				continue;
			}
			word.bounds.push(i - 1);
			words.push(_extends({}, word));
			word = null;
		} else {
			if (word === null) {
				word = {
					bounds: [i],
					characters: [character],
					get length() {
						return this.characters.length;
					}
				};
				continue;
			}
			word.characters.push(character);
		}
	}

	return words;
}

function getPreviousWord(words, x) {
	var _words$filter$reverse = words.filter(function (word) {
		return word.length > 1 ? word.bounds[0] < x || word.bounds[1] <= x : word.bounds[0] < x || word.bounds[1] < x;
	}).reverse();

	var _words$filter$reverse2 = _slicedToArray(_words$filter$reverse, 1);

	var next = _words$filter$reverse2[0];

	return next || words[0];
}

function getNextWord(words, x) {
	var _words$filter = words.filter(function (word) {
		return word.length > 1 ? word.bounds[0] >= x || word.bounds[1] > x : word.bounds[0] > x || word.bounds[1] > x;
	});

	var _words$filter2 = _slicedToArray(_words$filter, 1);

	var next = _words$filter2[0];

	return next || words[words.length - 1];
}

function getMatrixWord(matrix, cursor) {
	var direction = arguments.length <= 2 || arguments[2] === undefined ? 'up' : arguments[2];

	var matrixLine = (0, _getMatrixLine2.default)(matrix, cursor.y);
	var matrixLineWords = getMatrixLineWords(matrixLine);

	if (matrixLineWords.length === 0) {
		return {
			bounds: [0, 0],
			characters: [],
			length: 0
		};
	}

	var word = direction === 'up' ? getNextWord(matrixLineWords, cursor.x) : getPreviousWord(matrixLineWords, cursor.x);

	return word;
}

exports.default = getMatrixWord;