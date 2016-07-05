'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIsDeprecated = require('react-is-deprecated');

var _slapUtil = require('slap-util');

var _slapUtil2 = _interopRequireDefault(_slapUtil);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _fp = require('lodash/fp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var blank = ' ';

var deprecations = {
  currentLine: '.currentLine styling is deprecated, use .active instead',
  legacyStylingPrecedes: 'GutterLine renders with legacy .currentLine styles instead of .activeLine'
};

function getMarkup(children, styles, minWidth, maxWidth) {
  var fill = blank.repeat(maxWidth);
  var fillStart = (0, _fp.padStart)(minWidth);
  var content = '' + fillStart(String(children)) + fill;
  return _slapUtil2.default.markup(content, styles) + '{/}';
}

function getStyle(active, legacy, definition, activeDefinition) {
  if (legacy) {
    return {};
  }
  return active ? activeDefinition : definition;
}

var GutterLine = (_temp = _class = function (_Component) {
  _inherits(GutterLine, _Component);

  function GutterLine() {
    _classCallCheck(this, GutterLine);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GutterLine).apply(this, arguments));
  }

  _createClass(GutterLine, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var active = _props.active;
      var children = _props.children;
      var currentLine = _props.currentLine;
      var activeLine = _props.activeLine;
      var lineNumberWidth = _props.lineNumberWidth;
      var passedStyle = _props.style;
      var width = _props.width;

      var props = _objectWithoutProperties(_props, ['active', 'children', 'currentLine', 'activeLine', 'lineNumberWidth', 'style', 'width']);

      var usesLegacyStyles = Boolean(currentLine);

      if (usesLegacyStyles) {
        (0, _warning2.default)(!Boolean(activeLine), deprecations.legacyStylingPrecedes);
      }

      var content = usesLegacyStyles && active ? getMarkup(children, currentLine, lineNumberWidth, width) : children;

      var style = getStyle(active, usesLegacyStyles, passedStyle, activeLine);

      console.log({
        active: active,
        usesLegacyStyles: usesLegacyStyles,
        passedStyle: passedStyle,
        activeLine: activeLine
      });

      return _react2.default.createElement(
        'box',
        _extends({}, props, {
          style: style,
          tags: usesLegacyStyles,
          width: width
        }),
        content
      );
    }
  }]);

  return GutterLine;
}(_react.Component), _class.defaultProps = {
  children: '',
  lineNumberWidth: 0,
  style: {
    fg: 'white',
    bg: 'blue'
  },
  activeLine: {
    fg: 'black',
    bg: 'white'
  }
}, _class.propTypes = {
  children: _react.PropTypes.string.isRequired,
  currentLine: (0, _reactIsDeprecated.deprecate)(_react.PropTypes.string, deprecations.currentLine),
  activeLine: _react.PropTypes.shape({
    fg: _react.PropTypes.string,
    bg: _react.PropTypes.string
  }),
  lineNumberWidth: _react.PropTypes.number
}, _temp);
exports.default = GutterLine;