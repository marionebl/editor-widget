import React, {Component, PropTypes as t} from 'react';
import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';
import {noop} from 'lodash/fp';

import deep from './utilities/deep-defaults';
import getMatrix from './utilities/get-matrix';
import getMatrixLine from './utilities/get-matrix-line';
import resolveBinding from './utilities/resolve-binding';

import EditorBuffer from './editor-buffer';
import EditorCursor from './editor-cursor';
import EditorGutter from './editor-gutter';

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
		onNewLine: t.func.isRequired,
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
		onNewLine: noop,
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
		const {node} = this;
		if (node) {
			node.enableKeys();
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
		this.props.onDeletion(this.props);
	}

	handleInsertion(value) {
		this.props.onInsertion(value, this.props);
	}

	handleNewLine() {
		const {props} = this;
		props.onNewLine(props);
	}

	handleInput(value, character) {
		// IMPORTANT: This seems nonsensical but isn't. Blessed
		// will trigger two events for every enter/return keypress.
		// We elect to use only "return" here.
		// Pressing enter/return will always trigger both events
		if (character.full === 'enter') {
			return;
		}

		if (character.full === 'backspace') {
			this.handleDeletion();
		} else if (character.full === 'return') {
			this.handleNewLine();
		} else if (value) {
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
	render(props) {
		const {
			focus,
			cursor,
			gutter,
			children,
			...other
		} = props;

		const matrix = getMatrix(children);
		const matrixCursorLine = getMatrixLine(matrix, cursor.y);
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
							/>
				}
			</box>
		);
	}
}

export default Editor;
