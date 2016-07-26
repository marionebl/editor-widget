'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createEditorMapProps = createEditorMapProps;
exports.createEditorMapDispatch = createEditorMapDispatch;
exports.createEditorConnector = createEditorConnector;

var _reactRedux = require('react-redux');

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function editorMapPayload(_ref) {
	var children = _ref.children;
	var cursor = _ref.cursor;

	return {
		content: children,
		cursor: cursor
	};
}

function createEditorMapProps(ident) {
	var propMapper = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	return function (state) {
		var subState = ident ? state[ident] : state;

		var mapping = _extends({
			children: subState.contents,
			focus: subState.focus,
			cursor: subState.cursor,
			gutter: subState.gutter,
			highlight: subState.highlight
		}, propMapper);

		return ident ? _defineProperty({}, ident, mapping) : mapping;
	};
}

function createEditorMapDispatch(ident) {
	var dispatchMapper = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	var actions = (0, _actions2.default)(ident);

	return function (basicDispatch) {
		function getDispatcher(name, action) {
			return function () {
				var mappedDispatch = typeof dispatchMapper[name] === 'function' ? dispatchMapper[name] : function () {
					return true;
				};

				var result = mappedDispatch(action);
				if (result !== false) {
					basicDispatch(action);
				}
			};
		}

		var dispatchers = {
			onGoUp: function onGoUp(props) {
				getDispatcher('onGoUp', {
					type: actions.GO_UP,
					payload: editorMapPayload(props)
				})();
			},
			onGoUpInfinity: function onGoUpInfinity(props) {
				getDispatcher('onGoUpInfinity', {
					type: actions.GO_UP_INFINITY,
					payload: editorMapPayload(props)
				})();
			},
			onGoRight: function onGoRight(props) {
				getDispatcher('onGoRight', {
					type: actions.GO_RIGHT,
					payload: editorMapPayload(props)
				})();
			},
			onGoRightWord: function onGoRightWord(props) {
				getDispatcher('onGoRightWord', {
					type: actions.GO_RIGHT_WORD,
					payload: editorMapPayload(props)
				})();
			},
			onGoRightInfinity: function onGoRightInfinity(props) {
				getDispatcher('onGoRightInfinity', {
					type: actions.GO_RIGHT_INFINITY,
					payload: editorMapPayload(props)
				})();
			},
			onGoDown: function onGoDown(props) {
				getDispatcher('onGoDown', {
					type: actions.GO_DOWN,
					payload: editorMapPayload(props)
				})();
			},
			onGoDownInfinity: function onGoDownInfinity(props) {
				getDispatcher('onGoDownInfinity', {
					type: actions.GO_DOWN_INFINITY,
					payload: editorMapPayload(props)
				})();
			},
			onGoLeft: function onGoLeft(props) {
				getDispatcher('onGoLeft', {
					type: actions.GO_LEFT,
					payload: editorMapPayload(props)
				})();
			},
			onGoLeftWord: function onGoLeftWord(props) {
				getDispatcher('onGoLeftWord', {
					type: actions.GO_LEFT_WORD,
					payload: editorMapPayload(props)
				})();
			},
			onGoLeftInfinity: function onGoLeftInfinity(props) {
				getDispatcher('onGoLeftInfinity', {
					type: actions.GO_LEFT_INFINITY,
					payload: editorMapPayload(props)
				})();
			},
			onGoBack: function onGoBack(props) {
				getDispatcher('onGoBack', {
					type: actions.GO_BACK,
					payload: editorMapPayload(props)
				})();
			},
			onDeletion: function onDeletion(props) {
				getDispatcher('onDeletion', {
					type: actions.EDIT_DELETE,
					payload: editorMapPayload(props)
				})();
			},
			onInsertion: function onInsertion(value, _ref3) {
				var cursor = _ref3.cursor;

				getDispatcher('onInsertion', {
					type: actions.EDIT_INSERT,
					payload: {
						value: value,
						cursor: cursor
					}
				})();
			},
			onNewLine: function onNewLine(_ref4) {
				var cursor = _ref4.cursor;

				getDispatcher('onNewLine', {
					type: actions.EDIT_NEWLINE,
					payload: {
						cursor: cursor
					}
				})();
			}
		};

		return ident ? _defineProperty({}, ident, dispatchers) : dispatchers;
	};
}

function createEditorConnector(ident) {
	var propMapper = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	var dispatchMapper = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	var mapProps = createEditorMapProps(ident, propMapper);
	var mapDispatch = createEditorMapDispatch(ident, dispatchMapper);
	return (0, _reactRedux.connect)(mapProps, mapDispatch);
}

exports.default = createEditorConnector;