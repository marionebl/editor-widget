import createCursorReducer from './cursor';
import createContentsReducer from './contents';
import {combineReducers} from 'redux';

export function createEditorReducers(ident) {
	const reducers = {
		gutter(state = false) {
			return state;
		},
		focus(state = false) {
			return state;
		},
		highlight(state = false) {
			return state;
		},
		cursor: createCursorReducer(ident),
		contents: createContentsReducer(ident)
	};

	return ident ? {[ident]: combineReducers(reducers)} : reducers;
}

export default createEditorReducers;
