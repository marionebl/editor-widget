import {connect} from 'react-redux';
import createActions from '../actions';

function editorMapPayload({children, cursor}) {
	return {
		content: children,
		cursor
	};
}

export function createEditorMapProps(ident, propMapper = {}) {
	return state => {
		const subState = ident ? state[ident] : state;

		const mapping = {
			children: subState.contents,
			focus: subState.focus,
			cursor: subState.cursor,
			gutter: subState.gutter,
			highlight: subState.highlight,
			...propMapper
		};

		return ident ? {[ident]: mapping} : mapping;
	};
}

export function createEditorMapDispatch(ident, dispatchMapper = {}) {
	const actions = createActions(ident);

	return basicDispatch => {
		function getDispatcher(name, action) {
			return () => {
				const mappedDispatch = typeof dispatchMapper[name] === 'function' ?
					dispatchMapper[name] :
					() => true;

				const result = mappedDispatch(action);
				if (result !== false) {
					basicDispatch(action);
				}
			};
		}

		const dispatchers = {
			onGoUp(props) {
				getDispatcher('onGoUp', {
					type: actions.GO_UP,
					payload: editorMapPayload(props)
				})();
			},
			onGoUpInfinity(props) {
				getDispatcher('onGoUpInfinity', {
					type: actions.GO_UP_INFINITY,
					payload: editorMapPayload(props)
				})();
			},
			onGoRight(props) {
				getDispatcher('onGoRight', {
					type: actions.GO_RIGHT,
					payload: editorMapPayload(props)
				})();
			},
			onGoRightWord(props) {
				getDispatcher('onGoRightWord', {
					type: actions.GO_RIGHT_WORD,
					payload: editorMapPayload(props)
				})();
			},
			onGoRightInfinity(props) {
				getDispatcher('onGoRightInfinity', {
					type: actions.GO_RIGHT_INFINITY,
					payload: editorMapPayload(props)
				})();
			},
			onGoDown(props) {
				getDispatcher('onGoDown', {
					type: actions.GO_DOWN,
					payload: editorMapPayload(props)
				})();
			},
			onGoDownInfinity(props) {
				getDispatcher('onGoDownInfinity', {
					type: actions.GO_DOWN_INFINITY,
					payload: editorMapPayload(props)
				})();
			},
			onGoLeft(props) {
				getDispatcher('onGoLeft', {
					type: actions.GO_LEFT,
					payload: editorMapPayload(props)
				})();
			},
			onGoLeftWord(props) {
				getDispatcher('onGoLeftWord', {
					type: actions.GO_LEFT_WORD,
					payload: editorMapPayload(props)
				})();
			},
			onGoLeftInfinity(props) {
				getDispatcher('onGoLeftInfinity', {
					type: actions.GO_LEFT_INFINITY,
					payload: editorMapPayload(props)
				})();
			},
			onGoBack(props) {
				getDispatcher('onGoBack', {
					type: actions.GO_BACK,
					payload: editorMapPayload(props)
				})();
			},
			onDeletion(props) {
				getDispatcher('onDeletion', {
					type: actions.EDIT_DELETE,
					payload: editorMapPayload(props)
				})();
			},
			onInsertion(value, {cursor}) {
				getDispatcher('onInsertion', {
					type: actions.EDIT_INSERT,
					payload: {
						value,
						cursor
					}
				})();
			},
			onNewLine({cursor}) {
				getDispatcher('onNewLine', {
					type: actions.EDIT_NEWLINE,
					payload: {
						cursor
					}
				})();
			}
		};

		return ident ? {[ident]: dispatchers} : dispatchers;
	};
}

export function createEditorConnector(ident, propMapper = {}, dispatchMapper = {}) {
	const mapProps = createEditorMapProps(ident, propMapper);
	const mapDispatch = createEditorMapDispatch(ident, dispatchMapper);
	return connect(mapProps, mapDispatch);
}

export default createEditorConnector;
