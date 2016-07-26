import React, {Component, PropTypes as t} from 'react';
import autobind from 'autobind-decorator';
import emphasize from 'emphasize';
import pure from 'pure-render-decorator';
import {clamp} from 'lodash';
import {noop} from 'lodash/fp';

import deep from './utilities/deep-defaults';
import getMatrix from './utilities/get-matrix';
import getMatrixLine from './utilities/get-matrix-line';
import resolveBinding from './utilities/resolve-binding';

import EditorBuffer from './editor-buffer';
import EditorCursor from './editor-cursor';
import EditorGutter from './editor-gutter';

function getGutterWidth(gutter, lineCount) {
	// Gutter is hidden
	if (gutter === false) {
		return 0;
	}

	// Explicit width
	if (typeof gutter === 'object' && 'width' in gutter) {
		return gutter.width;
	}

	// Determine based on line number width
	return String(lineCount).length + 1;
}

function applyHighlight(language, content) {
	// Automatic highlighting
	if (language === true) {
		return emphasize.highlightAuto(content).value;
	}

	// Hard coded syntax
	if (typeof language === 'string') {
		return emphasize.highlight(language, content).value;
	}

	return content;
}

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
		highlight: t.oneOfType([t.bool, t.string]),
		onNavigation: t.func.isRequired,
		onEdit: t.func.isRequired,
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
		multiline: t.bool,
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
		highlight: false,
		cursor: {
			x: 0,
			y: 0
		},
		gutter: false,
		multiline: true,
		onNavigation: noop,
		onEdit: noop,
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

	state = {
		height: 0,
		width: 0
	};

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
		const {node, props} = this;

		if (!node) {
			return this;
		}

		if (props.focus) {
			node.enableKeys();
		}

		this.handleScreenResize();
		node.screen.on('resize', this.handleScreenResize);
	}

	componentWillReceiveProps() {
		const {node, props} = this;

		if (!node) {
			return this;
		}

		if (props.focus) {
			node.enableKeys();
		}

		this.handleScreenResize();
	}

	componentWillUnmount() {
		const {node} = this;
		if (node) {
			node.off('keypress');
			node.screen.off('resize', this.handleScreenResize);
		}
	}

	/**
	 * Event handlers
	 */
	handleScreenResize() {
		const {node} = this;
		if (node) {
			this.setState({
				width: node.width,
				height: node.height
			});
		}
	}

	handleBinding(binding) {
		const {props} = this;

		props.onNavigation(props, binding);

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

		if (props.multiline === false) {
			return;
		}

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
	render(props, state) {
		const {
			focus,
			highlight,
			cursor,
			gutter,
			children,
			multiline,
			...other
		} = props;

		const {
			width,
			height: measuredHeight
		} = state;

		const content = applyHighlight(highlight, children);

		const height = multiline ? measuredHeight : 1;
		const matrix = multiline ? getMatrix(children) : [getMatrix(children)[0]];
		const matrixCursorLine = multiline ? getMatrixLine(matrix, cursor.y) : getMatrixLine(matrix, 0);

		const gutterWidth = getGutterWidth(gutter, matrix.length);
		const gutterOffsetX = gutterWidth > 0 ? gutterWidth + 2 : 0;
		const cursorX = clamp(cursor.x, 0, Math.min(width - gutterOffsetX, matrixCursorLine.length));
		const cursorY = multiline ? clamp(cursor.y, 0, Math.min(height - 1, matrix.length)) : 0;
		const scrollY = multiline ? clamp(cursor.y - height + 1, 0, matrix.length) : 0;
		const scrollX = multiline ? clamp(cursor.x - width + 1 + gutterOffsetX, 0, matrixCursorLine.length) : 0;

		const activeLine = multiline ? cursor.y : 0;
		const active = focus ? activeLine : -1;
		const lines = Math.min(height, matrix.length);

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
							{...gutter}
							offset={scrollY}
							lines={lines}
							active={active}
							/>
				}
				{
					<EditorBuffer
						offsetX={scrollX}
						offsetY={scrollY}
						maxY={height}
						left={gutterOffsetX}
						>
						{content}
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
