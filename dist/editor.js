'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Editor = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp2;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _emphasize = require('emphasize');

var _emphasize2 = _interopRequireDefault(_emphasize);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _lodash = require('lodash');

var _fp = require('lodash/fp');

var _deepDefaults = require('./utilities/deep-defaults');

var _deepDefaults2 = _interopRequireDefault(_deepDefaults);

var _getMatrix = require('./utilities/get-matrix');

var _getMatrix2 = _interopRequireDefault(_getMatrix);

var _getMatrixLine = require('./utilities/get-matrix-line');

var _getMatrixLine2 = _interopRequireDefault(_getMatrixLine);

var _resolveBinding = require('./utilities/resolve-binding');

var _resolveBinding2 = _interopRequireDefault(_resolveBinding);

var _editorBuffer = require('./editor-buffer');

var _editorBuffer2 = _interopRequireDefault(_editorBuffer);

var _editorCursor = require('./editor-cursor');

var _editorCursor2 = _interopRequireDefault(_editorCursor);

var _editorGutter = require('./editor-gutter');

var _editorGutter2 = _interopRequireDefault(_editorGutter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GIT_SEPARATOR = '------------------------ >8 ------------------------\n';

function getGutterWidth(gutter, lineCount) {
	// Gutter is hidden
	if (gutter === false) {
		return 0;
	}

	// Explicit width
	if ((typeof gutter === 'undefined' ? 'undefined' : _typeof(gutter)) === 'object' && 'width' in gutter) {
		return gutter.width;
	}

	// Determine based on line number width
	return String(lineCount).length + 1;
}

function applyHighlight(language, content) {
	// Automatic highlighting
	if (language === true) {
		return _emphasize2.default.highlightAuto(content).value;
	}

	// Hard coded syntax
	if (typeof language === 'string') {
		if (language === 'git') {
			var fragments = content.split(GIT_SEPARATOR);

			if (fragments.length < 2) {
				return _emphasize2.default.highlight('bash', content).value;
			}

			var _fragments = _slicedToArray(fragments, 2);

			var _fragments$ = _fragments[0];
			var commentary = _fragments$ === undefined ? '' : _fragments$;
			var _fragments$2 = _fragments[1];
			var diff = _fragments$2 === undefined ? '' : _fragments$2;


			var result = [_emphasize2.default.highlight('bash', '' + commentary + GIT_SEPARATOR).value, diff.split('\n').map(function (line) {
				if (line[0] === '#') {
					return _emphasize2.default.highlight('bash', line || '').value;
				}
				return _emphasize2.default.highlight('diff', line || '').value;
			}).join('\n')].join('');

			return result;
		}

		return _emphasize2.default.highlight(language, content).value;
	}

	return content;
}

var Editor = exports.Editor = (0, _pureRenderDecorator2.default)(_class = (0, _deepDefaults2.default)(_class = (0, _autobindDecorator2.default)(_class = (_temp2 = _class2 = function (_Component) {
	_inherits(Editor, _Component);

	function Editor() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, Editor);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Editor)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.node = null, _this.screen = null, _this.program = null, _this.store = null, _this.state = {
			height: 0,
			width: 0
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}
	/**
  * Class properties
  */


	/**
  * Instance properties
  */


	_createClass(Editor, [{
		key: 'saveNode',


		/**
   * Helper methods
   */
		value: function saveNode(ref) {
			var screen = ref.screen;
			var program = screen.program;

			this.node = ref;
			this.screen = screen;
			this.program = program;
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var node = this.node;
			var props = this.props;


			if (!node) {
				return this;
			}

			if (props.focus) {
				node.enableKeys();
			}

			this.handleScreenResize();
			node.screen.on('resize', this.handleScreenResize);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps() {
			var node = this.node;
			var props = this.props;


			if (!node) {
				return this;
			}

			if (props.focus) {
				node.enableKeys();
			}

			this.handleScreenResize();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var node = this.node;

			if (node) {
				node.off('keypress');
				node.screen.off('resize', this.handleScreenResize);
			}
		}

		/**
   * Event handlers
   */

	}, {
		key: 'handleScreenResize',
		value: function handleScreenResize() {
			var node = this.node;

			if (node) {
				this.setState({
					width: node.width,
					height: node.height
				});
			}
		}
	}, {
		key: 'handleBinding',
		value: function handleBinding(binding) {
			var props = this.props;


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
	}, {
		key: 'handleDeletion',
		value: function handleDeletion() {
			this.props.onDeletion(this.props);
		}
	}, {
		key: 'handleInsertion',
		value: function handleInsertion(value) {
			this.props.onInsertion(value, this.props);
		}
	}, {
		key: 'handleNewLine',
		value: function handleNewLine() {
			var props = this.props;


			if (props.multiline === false) {
				return;
			}

			props.onNewLine(props);
		}
	}, {
		key: 'handleInput',
		value: function handleInput(value, character) {
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
	}, {
		key: 'handleKeypress',
		value: function handleKeypress(value, character) {
			var _props = this.props;
			var keyBindings = _props.keyBindings;
			var focus = _props.focus;


			if (!focus) {
				return;
			}

			var binding = (0, _resolveBinding2.default)(character.full, keyBindings);

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

	}, {
		key: 'render',
		value: function render(props, state) {
			var focus = props.focus;
			var highlight = props.highlight;
			var cursor = props.cursor;
			var gutter = props.gutter;
			var children = props.children;
			var multiline = props.multiline;

			var other = _objectWithoutProperties(props, ['focus', 'highlight', 'cursor', 'gutter', 'children', 'multiline']);

			var width = state.width;
			var measuredHeight = state.height;


			var content = applyHighlight(highlight, children);

			var height = multiline ? measuredHeight : 1;
			var matrix = multiline ? (0, _getMatrix2.default)(children) : [(0, _getMatrix2.default)(children)[0]];
			var matrixCursorLine = multiline ? (0, _getMatrixLine2.default)(matrix, cursor.y) : (0, _getMatrixLine2.default)(matrix, 0);

			var gutterWidth = getGutterWidth(gutter, matrix.length);
			var gutterOffsetX = gutterWidth > 0 ? gutterWidth + 2 : 0;
			var cursorX = (0, _lodash.clamp)(cursor.x, 0, Math.min(width - gutterOffsetX, matrixCursorLine.length));
			var cursorY = multiline ? (0, _lodash.clamp)(cursor.y, 0, Math.min(height - 1, matrix.length)) : 0;
			var scrollY = multiline ? (0, _lodash.clamp)(cursor.y - height + 1, 0, matrix.length) : 0;
			var scrollX = multiline ? (0, _lodash.clamp)(cursor.x - width + 1 + gutterOffsetX, 0, matrixCursorLine.length) : 0;

			var activeLine = multiline ? cursor.y : 0;
			var active = focus ? activeLine : -1;
			var lines = Math.min(height, matrix.length);

			return _react2.default.createElement(
				'box',
				_extends({}, other, {
					ref: this.saveNode,
					onKeypress: this.handleKeypress
				}),
				gutter && _react2.default.createElement(_editorGutter2.default, _extends({
					width: gutterWidth
				}, gutter, {
					offset: scrollY,
					lines: lines,
					active: active
				})),
				_react2.default.createElement(
					_editorBuffer2.default,
					{
						offsetX: scrollX,
						offsetY: scrollY,
						maxY: height,
						left: gutterOffsetX
					},
					content
				),
				focus && cursor && _react2.default.createElement(_editorCursor2.default, {
					matrix: matrix,
					top: cursorY,
					left: cursorX + gutterOffsetX,
					style: cursor.style
				})
			);
		}
	}]);

	return Editor;
}(_react.Component), _class2.propTypes = {
	children: _react.PropTypes.string,
	focus: _react.PropTypes.bool,
	highlight: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.string]),
	onNavigation: _react.PropTypes.func.isRequired,
	onEdit: _react.PropTypes.func.isRequired,
	onGoUp: _react.PropTypes.func.isRequired,
	onGoRight: _react.PropTypes.func.isRequired,
	onGoRightWord: _react.PropTypes.func.isRequired,
	onGoRightInfinity: _react.PropTypes.func.isRequired,
	onGoDown: _react.PropTypes.func.isRequired,
	onGoDownInfinity: _react.PropTypes.func.isRequired,
	onGoLeft: _react.PropTypes.func.isRequired,
	onGoLeftWord: _react.PropTypes.func.isRequired,
	onGoLeftInfinity: _react.PropTypes.func.isRequired,
	onGoBack: _react.PropTypes.func.isRequired,
	onInsertion: _react.PropTypes.func.isRequired,
	onDeletion: _react.PropTypes.func.isRequired,
	onNewLine: _react.PropTypes.func.isRequired,
	cursor: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.shape({
		x: _react.PropTypes.number.isRequired,
		y: _react.PropTypes.number.isRequired,
		style: _react.PropTypes.any
	})]),
	gutter: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.shape(_editorGutter2.default.propTypes)]),
	multiline: _react.PropTypes.bool,
	keyBindings: _react.PropTypes.shape({
		goLeft: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goLeftWord: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goLeftInfinity: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goRight: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goRightWord: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goRightInfinity: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goUp: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goUpRange: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goUpInfinity: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goDown: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goDownPage: _react.PropTypes.arrayOf(_react.PropTypes.string),
		goDownInfinity: _react.PropTypes.arrayOf(_react.PropTypes.string)
	})
}, _class2.defaultProps = {
	children: '',
	focus: false,
	highlight: false,
	cursor: {
		x: 0,
		y: 0
	},
	gutter: false,
	multiline: true,
	onNavigation: _fp.noop,
	onEdit: _fp.noop,
	onGoUp: _fp.noop,
	onGoUpInfinity: _fp.noop,
	onGoRight: _fp.noop,
	onGoRightWord: _fp.noop,
	onGoRightInfinity: _fp.noop,
	onGoDown: _fp.noop,
	onGoDownInfinity: _fp.noop,
	onGoLeft: _fp.noop,
	onGoLeftWord: _fp.noop,
	onGoLeftInfinity: _fp.noop,
	onGoBack: _fp.noop,
	onDeletion: _fp.noop,
	onInsertion: _fp.noop,
	onNewLine: _fp.noop,
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
}, _temp2)) || _class) || _class) || _class;

exports.default = Editor;