import Editor from './editor';
import {createEditorReducers} from './reducers';
import {
	createEditorConnector,
	createEditorMapDispatch,
	createEditorMapProps
} from './connectors';

export {
	Editor,
	createEditorReducers,
	createEditorConnector,
	createEditorMapDispatch,
	createEditorMapProps
};

export EditorBuffer from './editor-buffer';
export EditorBufferLine from './editor-buffer-line';
export EditorGutter from './editor-gutter';
export EditorGutterLine from './editor-gutter-line';

export default Editor;
