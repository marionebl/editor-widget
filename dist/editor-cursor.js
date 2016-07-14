'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EditorCursor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _deepDefaults = require('./utilities/deep-defaults');

var _deepDefaults2 = _interopRequireDefault(_deepDefaults);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function updateCursor(program, top, left) {
	program.showCursor();
	program.cursorPos(top, left);
}

var EditorCursor = (0, _deepDefaults2.default)(_class = (0, _autobindDecorator2.default)(_class = (_temp2 = _class2 = function (_Component) {
	_inherits(EditorCursor, _Component);

	function EditorCursor() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, EditorCursor);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(EditorCursor)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.node = null, _this.screen = null, _this.program = null, _temp), _possibleConstructorReturn(_this, _ret);
	}

	/**
  * Instance properties
  */


	_createClass(EditorCursor, [{
		key: 'saveNode',


		/**
   * Helper methods
   */
		value: function saveNode(ref) {
			if (ref) {
				var screen = ref.screen;
				var program = screen.program;

				this.node = ref;
				this.screen = screen;
				this.program = program;
			}
		}
	}, {
		key: 'handlePosition',
		value: function handlePosition() {
			var program = this.program;
			var node = this.node;
			var _props = this.props;
			var top = _props.top;
			var left = _props.left;

			var offsetTop = node ? node.atop : 0;
			var offsetLeft = node ? node.aleft : 0;
			if (program) {
				updateCursor(program, top + offsetTop, left + offsetLeft);
			}
		}

		/**
   * Component lifecycle hooks
   */

	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.handlePosition();
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			this.handlePosition();
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement('box', {
				ref: this.saveNode,
				width: 0,
				height: 0
			});
		}
	}]);

	return EditorCursor;
}(_react.Component), _class2.propTypes = {
	top: _react.PropTypes.number.isRequired,
	left: _react.PropTypes.number.isRequired,
	style: _react.PropTypes.any
}, _class2.defaultProps = {
	style: {
		fg: 'black',
		bg: 'white'
	}
}, _temp2)) || _class) || _class;

exports.EditorCursor = EditorCursor;
exports.default = EditorCursor;