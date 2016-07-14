import {entries} from 'lodash/fp';

const GO_UP = 'react-blessed-editor/cursor/goUp';
const GO_UP_INFINITY = 'react-blessed-editor/cursor/goUpInfinity';
const GO_LEFT = 'react-blessed-editor/cursor/goLeft';
const GO_LEFT_WORD = 'react-blessed-editor/cursor/goLeftWord';
const GO_LEFT_INFINITY = 'react-blessed-editor/cursor/goLeftInfinity';
const GO_DOWN = 'react-blessed-editor/cursor/goDown';
const GO_DOWN_INFINITY = 'react-blessed-editor/cursor/goDownInfinity';
const GO_RIGHT = 'react-blessed-editor/cursor/goRight';
const GO_RIGHT_WORD = 'react-blessed-editor/cursor/goRightWord';
const GO_RIGHT_INFINITY = 'react-blessed-editor/cursor/goRightInfinity';
const GO_BACK = 'react-blessed-editor/cursor/goBack';

const EDIT_DELETE = 'react-blessed-editor/contents/editDelete';
const EDIT_INSERT = 'react-blessed-editor/contents/editInsert';
const EDIT_NEWLINE = 'react-blessed-editor/contents/editNewline';

export function createActions(ident = '') {
	const actions = {
		GO_UP,
		GO_UP_INFINITY,
		GO_LEFT,
		GO_LEFT_WORD,
		GO_LEFT_INFINITY,
		GO_DOWN,
		GO_DOWN_INFINITY,
		GO_RIGHT,
		GO_RIGHT_WORD,
		GO_RIGHT_INFINITY,
		GO_BACK,
		EDIT_DELETE,
		EDIT_INSERT,
		EDIT_NEWLINE
	};

	return entries(actions).reduce((registry, entry) => {
		const [key, value] = entry;
		registry[key] = `${value}?${ident}`;
		return registry;
	}, {});
}

export default createActions;
