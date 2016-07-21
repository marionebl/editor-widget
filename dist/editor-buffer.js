'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EditorBuffer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _desc, _value, _class2, _class3, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _emphasize = require('emphasize');

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _lodash = require('lodash');

var _deepDefaults = require('./utilities/deep-defaults');

var _deepDefaults2 = _interopRequireDefault(_deepDefaults);

var _editorBufferLine = require('./editor-buffer-line');

var _editorBufferLine2 = _interopRequireDefault(_editorBufferLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var EditorBuffer = exports.EditorBuffer = (0, _pureRenderDecorator2.default)(_class = (0, _deepDefaults2.default)(_class = (_class2 = (_temp2 = _class3 = function (_Component) {
	_inherits(EditorBuffer, _Component);

	function EditorBuffer() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, EditorBuffer);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(EditorBuffer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.references = {}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(EditorBuffer, [{
		key: 'reference',
		value: function reference(name) {
			var _this2 = this;

			return function (reference) {
				if (reference instanceof _react.Component) {
					_this2.references[name] = reference.root;
				} else {
					_this2.references[name] = reference;
				}
			};
		}
	}, {
		key: 'render',
		value: function render(props) {
			var children = props.children;
			var offsetX = props.offsetX;
			var offsetY = props.offsetY;
			var left = props.left;
			var maxY = props.maxY;

			//		const {value: content} = highlightAuto(children);

			var lines = children.split('\n');
			var upperBound = (0, _lodash.clamp)(maxY + offsetY, offsetY, lines.length);
			var visibleLines = lines.slice(offsetY, upperBound);

			return _react2.default.createElement(
				'box',
				_extends({}, props, {
					ref: this.reference('root'),
					wrap: false,
					tags: false,
					left: left - offsetX
				}),
				visibleLines.map(function (line, y) {
					var intersectsRow = y + offsetY;

					return _react2.default.createElement(
						_editorBufferLine2.default,
						{
							top: y,
							key: y,
							row: intersectsRow
						},
						line
					);
				})
			);
		}
	}]);

	return EditorBuffer;
}(_react.Component), _class3.defaultProps = {
	lines: [],
	offsetY: 0,
	maxY: Infinity
}, _class3.propTypes = {
	children: _react.PropTypes.string,
	offsetY: _react.PropTypes.number.isRequired,
	maxY: _react.PropTypes.number.isRequired,
	lines: _react.PropTypes.arrayOf(_react.PropTypes.string).isRequired
}, _temp2), (_applyDecoratedDescriptor(_class2.prototype, 'reference', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, 'reference'), _class2.prototype)), _class2)) || _class) || _class;

exports.default = EditorBuffer;