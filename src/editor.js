import React, {Component, PropTypes as t} from 'react';
import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';
import {merge, noop} from 'lodash/fp';
import {createStore, combineReducers} from 'redux';

import deep from './utilities/deep-defaults';
import getMatrix from './utilities/get-matrix';
import getMatrixLine from './utilities/get-matrix-line';
import getMatrixCharacter from './utilities/get-matrix-character';
import resolveBinding from './utilities/resolve-binding';

import EditorBuffer from './editor-buffer';
import EditorCursor from './editor-cursor';
import EditorGutter from './editor-gutter';

import reducers from './reducers';
import {editorMapDispatch, editorMapProps} from './connectors/editor';

@pure
@deep
@autobind
export class Editor extends Component {
	/**
	 * Class properties
	 */
	static propTypes = {
		children: t.string,
		focus: t.bool,
		stateful: t.bool,
		onGoUp: t.func.isRequired,
		onGoRight: t.func.isRequired,
		onGoRightWord: t.func.isRequired,
		onGoRightInfinity: t.func.isRequired,
		onGoDown: t.func.isRequired,
		onGoDownInfinity: t.func.isRequired,
		onGoLeft: t.func.isRequired,
		onGoLeftWord: t.func.isRequired,
		onGoLeftInfinity: t.func.isRequired,
		onGoBack: t.func.isRequired,
		onInsertion: t.func.isRequired,
		onDeletion: t.func.isRequired,
		cursor: t.oneOfType([
			t.bool,
			t.shape({
				x: t.number.isRequired,
				y: t.number.isRequired,
				style: t.any
			})
		]),
		gutter: t.oneOfType([
			t.bool,
			t.shape(EditorGutter.propTypes)
		]),
		keyBindings: t.shape({
			goLeft: t.arrayOf(t.string),
			goLeftWord: t.arrayOf(t.string),
			goLeftInfinity: t.arrayOf(t.string),
			goRight: t.arrayOf(t.string),
			goRightWord: t.arrayOf(t.string),
			goRightInfinity: t.arrayOf(t.string),
			goUp: t.arrayOf(t.string),
			goUpRange: t.arrayOf(t.string),
			goUpInfinity: t.arrayOf(t.string),
			goDown: t.arrayOf(t.string),
			goDownPage: t.arrayOf(t.string),
			goDownInfinity: t.arrayOf(t.string)
		})
	};

	static defaultProps = {
		children: '',
		focus: false,
		cursor: false,
		gutter: false,
		stateful: false,
		onGoUp: noop,
		onGoUpInfinity: noop,
		onGoRight: noop,
		onGoRightWord: noop,
		onGoRightInfinity: noop,
		onGoDown: noop,
		onGoDownInfinity: noop,
		onGoLeft: noop,
		onGoLeftWord: noop,
		onGoLeftInfinity: noop,
		onGoBack: noop,
		onDeletion: noop,
		onInsertion: noop,
		keyBindings: {
			goLeft: ['left'],
			goLeftWord: ['C-left'],
			goLeftInfinity: ['C-a', 'home'],
			goRight: ['right'],
			goRightWord: ['C-right'],
			goRightInfinity: ['C-e', 'end'],
			goUp: ['up'],
			goUpPage: ['pageup'],
			goUpInfinity: ['C-home'],
			goDown: ['down'],
			goDownPage: ['pagedown'],
			goDownInfinity: ['C-end']
		}
	};

	/**
	 * Instance properties
	 */
	node = null;
	screen = null;
	program = null;
	store = null;

	/**
	 * Helper methods
	 */
	saveNode(ref) {
		const {screen} = ref;
		const {program} = screen;
		this.node = ref;
		this.screen = screen;
		this.program = program;
	}

	componentDidMount() {
		const {props, node} = this;
		if (node) {
			node.enableKeys();
		}
		if (props.stateful) {
			const combined = combineReducers(reducers);
			const initial = merge({contents: props.children});
			const store = createStore(combined, initial(props));
			const dispatchers = editorMapDispatch(store.dispatch);
			const map = merge(dispatchers);

			store.subscribe(() => {
				const state = store.getState();
				const mapped = map(editorMapProps(state));
				this.setState(mapped);
			});
		}
	}

	componentWillUnmount() {
		const {node} = this;
		if (node) {
			node.off('keypress');
		}
	}

	/**
	 * Event handlers
	 */
	handleBinding(binding) {
		const {props} = this;

		switch (binding) {
			/**
			 * ↑
			 */
			case 'goUp':
				props.onGoUp(props);
				break;
			case 'goUpInfinity':
				props.onGoUpInfinity(props);
				break;

			/**
			 * →
			 */
			case 'goRight':
				props.onGoRight(props);
				break;
			case 'goRightWord':
				props.onGoRightWord(props);
				break;
			case 'goRightInfinity':
				props.onGoRightInfinity(props);
				break;

			/**
			 * ↓
			 */
			case 'goDown':
				props.onGoDown(props);
				break;
			case 'goDownInfinity':
				props.onGoDownInfinity(props);
				break;

			/**
			 * ←
			 */
			case 'goLeft':
				props.onGoLeft(props);
				break;
			case 'goLeftWord':
				props.onGoLeftWord(props);
				break;
			case 'goLeftInfinity':
				props.onGoLeftInfinity(props);
				break;
			default:
				break;
		}
	}

	handleDeletion() {
		this.props.onGoBack(this.props);
		this.props.onDeletion(this.props);
	}

	handleInsertion(value) {
		this.props.onInsertion(value, this.props);
		this.props.onGoRight(this.props);
	}

	handleInput(value, character) {
		if (character.full === 'backspace') {
			this.handleDeletion();
		} else {
			this.handleInsertion(value);
		}
	}

	handleKeypress(value, character) {
		const {keyBindings, focus} = this.props;
		if (!focus) {
			return;
		}

		const binding = resolveBinding(character.full, keyBindings);

		if (binding) {
			this.handleBinding(binding);
		} else {
			this.handleInput(value, character);
		}
	}

	/**
	 * Render function
	 * - basic and cheap display value computation
	 * - invocation of sub components
	 */
	render(props, state) {
		const source = props.stateful ? state : props;

		const {
			focus,
			cursor,
			gutter,
			children,
			...other
		} = source;

		const matrix = getMatrix(children);
		const matrixCursorLine = getMatrixLine(matrix, cursor.y);
		const cursorContent = getMatrixCharacter(matrix, cursor);
		const cursorY = Math.min(matrix.length, cursor.y);
		const cursorX = Math.min(matrixCursorLine.length, cursor.x);

		const active = focus ? cursor.y : -1;

		const gutterProps = typeof gutter === 'object' ? gutter : {};

		const gutterWidth = 'width' in gutterProps ?
			gutterProps.width :
			String(matrix.length).length + 1;

		const gutterOffsetX = gutterWidth + 2;

		return (
			<box
				{...other}
				ref={this.saveNode}
				onKeypress={this.handleKeypress}
				>
				{
					gutter &&
						<EditorGutter
							width={gutterWidth}
							{...gutterProps}
							lines={matrix.length}
							active={active}
							/>
				}
				{
					<EditorBuffer left={gutterOffsetX}>
						{children}
					</EditorBuffer>
				}
				{
					focus && cursor &&
						<EditorCursor
							matrix={matrix}
							top={cursorY}
							left={cursorX + gutterOffsetX}
							style={cursor.style}
							>
							{cursorContent}
						</EditorCursor>
				}
			</box>
		);
	}
}

export default Editor;
