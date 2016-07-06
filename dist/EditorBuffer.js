'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp, _class3, _desc, _value, _class4, _class5, _temp3;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _fp = require('lodash/fp');

var _blessed = require('blessed');

var _slapUtil = require('slap-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BufferLine = (0, _pureRenderDecorator2.default)(_class = (_temp = _class2 = function (_Component) {
  _inherits(BufferLine, _Component);

  function BufferLine() {
    _classCallCheck(this, BufferLine);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BufferLine).apply(this, arguments));
  }

  _createClass(BufferLine, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var children = _props.children;
      var column = _props.column;
      var maxWidth = _props.maxWidth;
      var row = _props.row;
      var markers = _props.markers;

      var props = _objectWithoutProperties(_props, ['children', 'column', 'maxWidth', 'row', 'markers']);

      var cropped = children.slice(column, column + maxWidth);

      var content = (0, _blessed.parseTags)('' + cropped + ' '.repeat(maxWidth));

      return _react2.default.createElement(
        'box',
        props,
        content
      );
    }
  }]);

  return BufferLine;
}(_react.Component), _class2.propTypes = {
  row: _react.PropTypes.number.isRequired,
  markers: _react.PropTypes.array.isRequired,
  children: _react.PropTypes.string.isRequired
}, _temp)) || _class;

var EditorBuffer = (0, _pureRenderDecorator2.default)(_class3 = (_class4 = (_temp3 = _class5 = function (_Component2) {
  _inherits(EditorBuffer, _Component2);

  function EditorBuffer() {
    var _Object$getPrototypeO;

    var _temp2, _this2, _ret;

    _classCallCheck(this, EditorBuffer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(EditorBuffer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this2), _this2.references = {}, _temp2), _possibleConstructorReturn(_this2, _ret);
  }

  _createClass(EditorBuffer, [{
    key: 'reference',
    value: function reference(name) {
      var _this3 = this;

      return function (reference) {
        if (reference instanceof _react.Component) {
          _this3.references[name] = reference.root;
        } else {
          _this3.references[name] = reference;
        }
      };
    }
  }, {
    key: 'reference',
    value: function reference(name) {
      var _this4 = this;

      return function (reference) {
        if (reference instanceof _react.Component) {
          _this4.references[name] = reference.root;
        } else {
          _this4.references[name] = reference;
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var props = (0, _fp.merge)(Buffer.defaultProps)(this.props);
      var lines = props.lines;
      var offsetX = props.offsetX;
      var offsetY = props.offsetY;
      var row = props.row;
      var size = props.size;
      var textBuffer = props.textBuffer;


      return _react2.default.createElement(
        'box',
        _extends({}, props, {
          ref: this.reference('root'),
          wrap: false,
          tags: false
        }),
        lines.map(function (line, y) {
          var intersectsRow = y + offsetY;
          var markers = textBuffer.findMarkers({ intersectsRow: intersectsRow });

          return _react2.default.createElement(
            BufferLine,
            {
              top: y,
              row: intersectsRow,
              column: offsetX,
              maxWidth: size.column,
              markers: markers
            },
            line
          );
        })
      );
    }
  }]);

  return EditorBuffer;
}(_react.Component), _class5.defaultProps = {
  lines: []
}, _class5.propTypes = {
  textBuffer: _react.PropTypes.any.isRequired,
  lines: _react.PropTypes.arrayOf(_react.PropTypes.string).isRequired
}, _temp3), (_applyDecoratedDescriptor(_class4.prototype, 'reference', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class4.prototype, 'reference'), _class4.prototype)), _class4)) || _class3;

exports.default = EditorBuffer;