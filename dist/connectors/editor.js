'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createEditorMapProps = createEditorMapProps;
exports.createEditorMapDispatch = createEditorMapDispatch;
exports.createEditorConnector = createEditorConnector;

var _reactRedux = require('react-redux');

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function editorMapPayload(_ref) {
	var children = _ref.children;
	var cursor = _ref.cursor;

	return {
		content: children,
		cursor: cursor
	};
}

function createEditorMapProps(ident) {
	return function (state) {
		var subState = ident ? state[ident] : state;

		return {
			children: subState.contents,
			focus: subState.focus,
			cursor: subState.cursor,
			gutter: subState.gutter
		};
	};
}

function createEditorMapDispatch(ident) {
	var actions = (0, _actions2.default)(ident);

	return function (dispatch) {
		return {
			onGoUp: function onGoUp(props) {
				dispatch({
					type: actions.GO_UP,
					payload: editorMapPayload(props)
				});
			},
			onGoUpInfinity: function onGoUpInfinity(props) {
				dispatch({
					type: actions.GO_UP_INFINITY,
					payload: editorMapPayload(props)
				});
			},
			onGoRight: function onGoRight(props) {
				dispatch({
					type: actions.GO_RIGHT,
					payload: editorMapPayload(props)
				});
			},
			onGoRightWord: function onGoRightWord(props) {
				dispatch({
					type: actions.GO_RIGHT_WORD,
					payload: editorMapPayload(props)
				});
			},
			onGoRightInfinity: function onGoRightInfinity(props) {
				dispatch({
					type: actions.GO_RIGHT_INFINITY,
					payload: editorMapPayload(props)
				});
			},
			onGoDown: function onGoDown(props) {
				dispatch({
					type: actions.GO_DOWN,
					payload: editorMapPayload(props)
				});
			},
			onGoDownInfinity: function onGoDownInfinity(props) {
				dispatch({
					type: actions.GO_DOWN_INFINITY,
					payload: editorMapPayload(props)
				});
			},
			onGoLeft: function onGoLeft(props) {
				dispatch({
					type: actions.GO_LEFT,
					payload: editorMapPayload(props)
				});
			},
			onGoLeftWord: function onGoLeftWord(props) {
				dispatch({
					type: actions.GO_LEFT_WORD,
					payload: editorMapPayload(props)
				});
			},
			onGoLeftInfinity: function onGoLeftInfinity(props) {
				dispatch({
					type: actions.GO_LEFT_INFINITY,
					payload: editorMapPayload(props)
				});
			},
			onGoBack: function onGoBack(props) {
				dispatch({
					type: actions.GO_BACK,
					payload: editorMapPayload(props)
				});
			},
			onDeletion: function onDeletion(props) {
				dispatch({
					type: actions.EDIT_DELETE,
					payload: editorMapPayload(props)
				});
			},
			onInsertion: function onInsertion(value, _ref2) {
				var cursor = _ref2.cursor;

				dispatch({
					type: actions.EDIT_INSERT,
					payload: {
						value: value,
						cursor: cursor
					}
				});
			},
			onNewLine: function onNewLine(_ref3) {
				var cursor = _ref3.cursor;

				dispatch({
					type: actions.EDIT_NEWLINE,
					payload: {
						cursor: cursor
					}
				});
			}
		};
	};
}

function createEditorConnector(ident) {
	var mapProps = createEditorMapProps(ident);
	var mapDispatch = createEditorMapDispatch(ident);
	return (0, _reactRedux.connect)(mapProps, mapDispatch);
}

exports.default = createEditorConnector;