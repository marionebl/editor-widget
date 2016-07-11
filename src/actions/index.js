import {entries} from 'lodash/fp';

const GO_UP = 'goUp';
const GO_UP_INFINITY = 'goUpInfinity';
const GO_LEFT = 'goLeft';
const GO_LEFT_WORD = 'goLeftWord';
const GO_LEFT_INFINITY = 'goLeftInfinity';
const GO_DOWN = 'goDown';
const GO_DOWN_INFINITY = 'goDownInfinity';
const GO_RIGHT = 'goRight';
const GO_RIGHT_WORD = 'goRightWord';
const GO_RIGHT_INFINITY = 'goRightInfinity';
const GO_BACK = 'goBack';

const EDIT_DELETE = 'editDelete';
const EDIT_INSERT = 'editInsert';
const EDIT_NEWLINE = 'editNewline';

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
