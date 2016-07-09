'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.editorMapProps = editorMapProps;
exports.editorMapDispatch = editorMapDispatch;
exports.editorConnector = editorConnector;

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

function editorMapProps(state) {
	return {
		children: state.contents,
		focus: state.focus,
		cursor: state.cursor,
		gutter: state.gutter
	};
}

function editorMapDispatch(dispatch) {
	return {
		onGoUp: function onGoUp(props) {
			dispatch({
				type: _actions2.default.GO_UP,
				payload: editorMapPayload(props)
			});
		},
		onGoUpInfinity: function onGoUpInfinity(props) {
			dispatch({
				type: _actions2.default.GO_UP_INFINITY,
				payload: editorMapPayload(props)
			});
		},
		onGoRight: function onGoRight(props) {
			dispatch({
				type: _actions2.default.GO_RIGHT,
				payload: editorMapPayload(props)
			});
		},
		onGoRightWord: function onGoRightWord(props) {
			dispatch({
				type: _actions2.default.GO_RIGHT_WORD,
				payload: editorMapPayload(props)
			});
		},
		onGoRightInfinity: function onGoRightInfinity(props) {
			dispatch({
				type: _actions2.default.GO_RIGHT_INFINITY,
				payload: editorMapPayload(props)
			});
		},
		onGoDown: function onGoDown(props) {
			dispatch({
				type: _actions2.default.GO_DOWN,
				payload: editorMapPayload(props)
			});
		},
		onGoDownInfinity: function onGoDownInfinity(props) {
			dispatch({
				type: _actions2.default.GO_DOWN_INFINITY,
				payload: editorMapPayload(props)
			});
		},
		onGoLeft: function onGoLeft(props) {
			dispatch({
				type: _actions2.default.GO_LEFT,
				payload: editorMapPayload(props)
			});
		},
		onGoLeftWord: function onGoLeftWord(props) {
			dispatch({
				type: _actions2.default.GO_LEFT_WORD,
				payload: editorMapPayload(props)
			});
		},
		onGoLeftInfinity: function onGoLeftInfinity(props) {
			dispatch({
				type: _actions2.default.GO_LEFT_INFINITY,
				payload: editorMapPayload(props)
			});
		},
		onGoBack: function onGoBack(props) {
			dispatch({
				type: _actions2.default.GO_BACK,
				payload: editorMapPayload(props)
			});
		},
		onDeletion: function onDeletion(props) {
			dispatch({
				type: _actions2.default.EDIT_DELETE,
				payload: editorMapPayload(props)
			});
		},
		onInsertion: function onInsertion(value, _ref2) {
			var cursor = _ref2.cursor;

			dispatch({
				type: _actions2.default.EDIT_INSERT,
				payload: {
					value: value,
					cursor: cursor
				}
			});
		}
	};
}

function editorConnector(Component) {
	return (0, _reactRedux.connect)(editorMapProps, editorMapDispatch)(Component);
}

exports.default = editorConnector;