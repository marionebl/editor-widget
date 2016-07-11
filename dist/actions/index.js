'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.createActions = createActions;

var _fp = require('lodash/fp');

var GO_UP = 'goUp';
var GO_UP_INFINITY = 'goUpInfinity';
var GO_LEFT = 'goLeft';
var GO_LEFT_WORD = 'goLeftWord';
var GO_LEFT_INFINITY = 'goLeftInfinity';
var GO_DOWN = 'goDown';
var GO_DOWN_INFINITY = 'goDownInfinity';
var GO_RIGHT = 'goRight';
var GO_RIGHT_WORD = 'goRightWord';
var GO_RIGHT_INFINITY = 'goRightInfinity';
var GO_BACK = 'goBack';

var EDIT_DELETE = 'editDelete';
var EDIT_INSERT = 'editInsert';
var EDIT_NEWLINE = 'editNewline';

function createActions() {
	var ident = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

	var actions = {
		GO_UP: GO_UP,
		GO_UP_INFINITY: GO_UP_INFINITY,
		GO_LEFT: GO_LEFT,
		GO_LEFT_WORD: GO_LEFT_WORD,
		GO_LEFT_INFINITY: GO_LEFT_INFINITY,
		GO_DOWN: GO_DOWN,
		GO_DOWN_INFINITY: GO_DOWN_INFINITY,
		GO_RIGHT: GO_RIGHT,
		GO_RIGHT_WORD: GO_RIGHT_WORD,
		GO_RIGHT_INFINITY: GO_RIGHT_INFINITY,
		GO_BACK: GO_BACK,
		EDIT_DELETE: EDIT_DELETE,
		EDIT_INSERT: EDIT_INSERT,
		EDIT_NEWLINE: EDIT_NEWLINE
	};

	return (0, _fp.entries)(actions).reduce(function (registry, entry) {
		var _entry = _slicedToArray(entry, 2);

		var key = _entry[0];
		var value = _entry[1];

		registry[key] = value + '?' + ident;
		return registry;
	}, {});
}

exports.default = createActions;