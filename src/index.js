import Editor from './editor';
import editorReducers from './reducers';
import {editor as connect} from './connectors';

export {Editor, editorReducers, connect};
export EditorBuffer from './editor-buffer';
export EditorBufferLine from './editor-buffer-line';
export EditorGutter from './editor-gutter';
export EditorGutterLine from './editor-gutter-line';

export default Editor;
