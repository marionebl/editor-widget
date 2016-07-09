'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EditorGutterLine = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _deepDefaults = require('./utilities/deep-defaults');

var _deepDefaults2 = _interopRequireDefault(_deepDefaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditorGutterLine = (0, _pureRenderDecorator2.default)(_class = (0, _deepDefaults2.default)(_class = (0, _autobindDecorator2.default)(_class = (_temp = _class2 = function (_Component) {
	_inherits(EditorGutterLine, _Component);

	function EditorGutterLine() {
		_classCallCheck(this, EditorGutterLine);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(EditorGutterLine).apply(this, arguments));
	}

	_createClass(EditorGutterLine, [{
		key: 'render',
		value: function render(props) {
			var active = props.active;
			var children = props.children;
			var passedStyle = props.style;
			var activeStyle = props.activeStyle;
			var width = props.width;

			var other = _objectWithoutProperties(props, ['active', 'children', 'style', 'activeStyle', 'width']);

			var style = active ? activeStyle : passedStyle;

			return _react2.default.createElement(
				'box',
				_extends({}, other, {
					style: style,
					width: width
				}),
				children
			);
		}
	}]);

	return EditorGutterLine;
}(_react.Component), _class2.defaultProps = {
	align: 'right',
	children: '',
	style: {
		fg: 'grey'
	},
	activeStyle: {
		fg: 'white',
		bold: true
	}
}, _class2.propTypes = {
	children: _react.PropTypes.string.isRequired,
	style: _react.PropTypes.shape({
		fg: _react.PropTypes.string,
		bg: _react.PropTypes.string
	}),
	activeStyle: _react.PropTypes.shape({
		fg: _react.PropTypes.string,
		bg: _react.PropTypes.string
	})
}, _temp)) || _class) || _class) || _class;

exports.EditorGutterLine = EditorGutterLine;
exports.default = EditorGutterLine;