'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fp = require('lodash/fp');

var _GutterLine = require('./GutterLine');

var _GutterLine2 = _interopRequireDefault(_GutterLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function plus(offset) {
  return function (index) {
    return index + offset + 1;
  };
}

var Gutter = function (_Component) {
  _inherits(Gutter, _Component);

  function Gutter() {
    _classCallCheck(this, Gutter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Gutter).apply(this, arguments));
  }

  _createClass(Gutter, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var lines = _props.lines;
      var width = _props.width;
      var style = _props.style;
      var active = _props.active;
      var activeStyle = _props.activeStyle;
      var offset = _props.offset;

      var other = _objectWithoutProperties(_props, ['lines', 'width', 'style', 'active', 'activeStyle', 'offset']);

      var account = plus(offset);
      var getRange = (0, _fp.times)(account);

      return _react2.default.createElement(
        'box',
        _extends({}, other, { wrap: false }),
        getRange(lines).map(function (line, offset) {
          return _react2.default.createElement(
            _GutterLine2.default,
            {
              width: width
              // style={style}
              , top: offset,
              active: offset === active
              // currentLine={style.currentLine}
              , activeLine: style.active,
              key: 'GutterLine-' + line
            },
            line
          );
        })
      );
    }
  }]);

  return Gutter;
}(_react.Component);

exports.default = Gutter;