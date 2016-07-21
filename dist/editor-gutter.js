'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EditorGutter = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fp = require('lodash/fp');

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _editorGutterLine = require('./editor-gutter-line');

var _editorGutterLine2 = _interopRequireDefault(_editorGutterLine);

var _plus = require('./utilities/plus');

var _deepDefaults = require('./utilities/deep-defaults');

var _deepDefaults2 = _interopRequireDefault(_deepDefaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditorGutter = (0, _pureRenderDecorator2.default)(_class = (0, _deepDefaults2.default)(_class = (0, _autobindDecorator2.default)(_class = (_temp = _class2 = function (_Component) {
	_inherits(EditorGutter, _Component);

	function EditorGutter() {
		_classCallCheck(this, EditorGutter);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(EditorGutter).apply(this, arguments));
	}

	_createClass(EditorGutter, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var node = this.node;

			if (node) {
				node.setIndex(1);
			}
		}
	}, {
		key: 'saveNode',
		value: function saveNode(ref) {
			this.node = ref;
		}
	}, {
		key: 'render',
		value: function render(props) {
			var lines = props.lines;
			var width = props.width;
			var style = props.style;
			var activeStyle = props.activeStyle;
			var active = props.active;
			var offset = props.offset;

			var other = _objectWithoutProperties(props, ['lines', 'width', 'style', 'activeStyle', 'active', 'offset']);

			var account = (0, _plus.plus)(offset);
			var getRange = (0, _fp.times)(account);

			return _react2.default.createElement(
				'box',
				_extends({}, other, {
					ref: this.saveNode,
					width: width + 2,
					wrap: false
				}),
				getRange(lines).map(function (line, y) {
					var isActive = y === active - offset;
					return _react2.default.createElement(
						_editorGutterLine2.default,
						{
							width: width,
							style: style,
							activeStyle: activeStyle,
							top: y,
							key: y,
							active: isActive,
							currentLine: style.currentLine
						},
						String(line)
					);
				})
			);
		}
	}]);

	return EditorGutter;
}(_react.Component), _class2.propTypes = {
	lines: _react.PropTypes.number.isRequired,
	width: _react.PropTypes.number.isRequired,
	active: _react.PropTypes.number.isRequired,
	offset: _react.PropTypes.number,
	style: _react.PropTypes.shape({
		bg: _react.PropTypes.string,
		fg: _react.PropTypes.string
	}),
	activeStyle: _react.PropTypes.shape({
		bg: _react.PropTypes.string,
		fg: _react.PropTypes.string
	})
}, _class2.defaultProps = {
	style: {},
	activeStyle: {},
	lines: 0,
	active: -1,
	offset: 0,
	width: 6
}, _temp)) || _class) || _class) || _class;

exports.EditorGutter = EditorGutter;
exports.default = EditorGutter;