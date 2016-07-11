import {connect} from 'react-redux';
import createActions from '../actions';

function editorMapPayload({children, cursor}) {
	return {
		content: children,
		cursor
	};
}

export function createEditorMapProps(ident) {
	return state => {
		const subState = ident ? state[ident] : state;

		return {
			children: subState.contents,
			focus: subState.focus,
			cursor: subState.cursor,
			gutter: subState.gutter
		};
	};
}

export function createEditorMapDispatch(ident) {
	const actions = createActions(ident);

	return dispatch => {
		return {
			onGoUp(props) {
				dispatch({
					type: actions.GO_UP,
					payload: editorMapPayload(props)
				});
			},
			onGoUpInfinity(props) {
				dispatch({
					type: actions.GO_UP_INFINITY,
					payload: editorMapPayload(props)
				});
			},
			onGoRight(props) {
				dispatch({
					type: actions.GO_RIGHT,
					payload: editorMapPayload(props)
				});
			},
			onGoRightWord(props) {
				dispatch({
					type: actions.GO_RIGHT_WORD,
					payload: editorMapPayload(props)
				});
			},
			onGoRightInfinity(props) {
				dispatch({
					type: actions.GO_RIGHT_INFINITY,
					payload: editorMapPayload(props)
				});
			},
			onGoDown(props) {
				dispatch({
					type: actions.GO_DOWN,
					payload: editorMapPayload(props)
				});
			},
			onGoDownInfinity(props) {
				dispatch({
					type: actions.GO_DOWN_INFINITY,
					payload: editorMapPayload(props)
				});
			},
			onGoLeft(props) {
				dispatch({
					type: actions.GO_LEFT,
					payload: editorMapPayload(props)
				});
			},
			onGoLeftWord(props) {
				dispatch({
					type: actions.GO_LEFT_WORD,
					payload: editorMapPayload(props)
				});
			},
			onGoLeftInfinity(props) {
				dispatch({
					type: actions.GO_LEFT_INFINITY,
					payload: editorMapPayload(props)
				});
			},
			onGoBack(props) {
				dispatch({
					type: actions.GO_BACK,
					payload: editorMapPayload(props)
				});
			},
			onDeletion(props) {
				dispatch({
					type: actions.EDIT_DELETE,
					payload: editorMapPayload(props)
				});
			},
			onInsertion(value, {cursor}) {
				dispatch({
					type: actions.EDIT_INSERT,
					payload: {
						value,
						cursor
					}
				});
			},
			onNewLine({cursor}) {
				dispatch({
					type: actions.EDIT_NEWLINE,
					payload: {
						cursor
					}
				});
			}
		};
	};
}

export function createEditorConnector(ident) {
	const mapProps = createEditorMapProps(ident);
	const mapDispatch = createEditorMapDispatch(ident);
	return connect(mapProps, mapDispatch);
}

export default createEditorConnector;
