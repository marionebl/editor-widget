'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.createActions = createActions;

var _fp = require('lodash/fp');

var GO_UP = 'react-blessed-editor/cursor/goUp';
var GO_UP_INFINITY = 'react-blessed-editor/cursor/goUpInfinity';
var GO_LEFT = 'react-blessed-editor/cursor/goLeft';
var GO_LEFT_WORD = 'react-blessed-editor/cursor/goLeftWord';
var GO_LEFT_INFINITY = 'react-blessed-editor/cursor/goLeftInfinity';
var GO_DOWN = 'react-blessed-editor/cursor/goDown';
var GO_DOWN_INFINITY = 'react-blessed-editor/cursor/goDownInfinity';
var GO_RIGHT = 'react-blessed-editor/cursor/goRight';
var GO_RIGHT_WORD = 'react-blessed-editor/cursor/goRightWord';
var GO_RIGHT_INFINITY = 'react-blessed-editor/cursor/goRightInfinity';
var GO_BACK = 'react-blessed-editor/cursor/goBack';

var EDIT_DELETE = 'react-blessed-editor/contents/editDelete';
var EDIT_INSERT = 'react-blessed-editor/contents/editInsert';
var EDIT_NEWLINE = 'react-blessed-editor/contents/editNewline';

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