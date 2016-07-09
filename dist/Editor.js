'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Editor = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _fp = require('lodash/fp');

var _redux = require('redux');

var _deepDefaults = require('./utilities/deep-defaults');

var _deepDefaults2 = _interopRequireDefault(_deepDefaults);

var _getMatrix = require('./utilities/get-matrix');

var _getMatrix2 = _interopRequireDefault(_getMatrix);

var _getMatrixLine = require('./utilities/get-matrix-line');

var _getMatrixLine2 = _interopRequireDefault(_getMatrixLine);

var _getMatrixCharacter = require('./utilities/get-matrix-character');

var _getMatrixCharacter2 = _interopRequireDefault(_getMatrixCharacter);

var _resolveBinding = require('./utilities/resolve-binding');

var _resolveBinding2 = _interopRequireDefault(_resolveBinding);

var _editorBuffer = require('./editor-buffer');

var _editorBuffer2 = _interopRequireDefault(_editorBuffer);

var _editorCursor = require('./editor-cursor');

var _editorCursor2 = _interopRequireDefault(_editorCursor);

var _editorGutter = require('./editor-gutter');

var _editorGutter2 = _interopRequireDefault(_editorGutter);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _editor = require('./connectors/editor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Editor = exports.Editor = (0, _pureRenderDecorator2.default)(_class = (0, _deepDefaults2.default)(_class = (0, _autobindDecorator2.default)(_class = (_temp2 = _class2 = function (_Component) {
	_inherits(Editor, _Component);

	function Editor() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, Editor);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Editor)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.node = null, _this.screen = null, _this.program = null, _this.store = null, _temp), _possibleConstructorReturn(_this, _ret);
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
			var _this2 = this;

			var props = this.props;
			var node = this.node;

			if (node) {
				node.enableKeys();
			}
			if (props.stateful) {
				(function () {
					var combined = (0, _redux.combineReducers)(_reducers2.default);
					var initial = (0, _fp.merge)({ contents: props.children });
					var store = (0, _redux.createStore)(combined, initial(props));
					var dispatchers = (0, _editor.editorMapDispatch)(store.dispatch);
					var map = (0, _fp.merge)(dispatchers);

					store.subscribe(function () {
						var state = store.getState();
						var mapped = map((0, _editor.editorMapProps)(state));
						_this2.setState(mapped);
					});
				})();
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var node = this.node;

			if (node) {
				node.off('keypress');
			}
		}

		/**
   * Event handlers
   */

	}, {
		key: 'handleBinding',
		value: function handleBinding(binding) {
			var props = this.props;


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
			this.props.onGoBack(this.props);
			this.props.onDeletion(this.props);
		}
	}, {
		key: 'handleInsertion',
		value: function handleInsertion(value) {
			this.props.onInsertion(value, this.props);
			this.props.onGoRight(this.props);
		}
	}, {
		key: 'handleInput',
		value: function handleInput(value, character) {
			if (character.full === 'backspace') {
				this.handleDeletion();
			} else {
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
			var source = props.stateful ? state : props;

			var focus = source.focus;
			var cursor = source.cursor;
			var gutter = source.gutter;
			var children = source.children;

			var other = _objectWithoutProperties(source, ['focus', 'cursor', 'gutter', 'children']);

			var matrix = (0, _getMatrix2.default)(children);
			var matrixCursorLine = (0, _getMatrixLine2.default)(matrix, cursor.y);
			var cursorContent = (0, _getMatrixCharacter2.default)(matrix, cursor);
			var cursorY = Math.min(matrix.length, cursor.y);
			var cursorX = Math.min(matrixCursorLine.length, cursor.x);

			var active = focus ? cursor.y : -1;

			var gutterProps = (typeof gutter === 'undefined' ? 'undefined' : _typeof(gutter)) === 'object' ? gutter : {};

			var gutterWidth = 'width' in gutterProps ? gutterProps.width : String(matrix.length).length + 1;

			var gutterOffsetX = gutterWidth + 2;

			return _react2.default.createElement(
				'box',
				_extends({}, other, {
					ref: this.saveNode,
					onKeypress: this.handleKeypress
				}),
				gutter && _react2.default.createElement(_editorGutter2.default, _extends({
					width: gutterWidth
				}, gutterProps, {
					lines: matrix.length,
					active: active
				})),
				_react2.default.createElement(
					_editorBuffer2.default,
					{ left: gutterOffsetX },
					children
				),
				focus && cursor && _react2.default.createElement(
					_editorCursor2.default,
					{
						matrix: matrix,
						top: cursorY,
						left: cursorX + gutterOffsetX,
						style: cursor.style
					},
					cursorContent
				)
			);
		}
	}]);

	return Editor;
}(_react.Component), _class2.propTypes = {
	children: _react.PropTypes.string,
	focus: _react.PropTypes.bool,
	stateful: _react.PropTypes.bool,
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
	cursor: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.shape({
		x: _react.PropTypes.number.isRequired,
		y: _react.PropTypes.number.isRequired,
		style: _react.PropTypes.any
	})]),
	gutter: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.shape(_editorGutter2.default.propTypes)]),
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
	cursor: false,
	gutter: false,
	stateful: false,
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