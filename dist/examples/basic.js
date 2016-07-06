#!/usr/bin/env babel-node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _util = require('util');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _reactBlessed = require('react-blessed');

var _ = require('..');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function write(payload) {
  if (global.screen) {
    global.screen.log(payload);
  } else {
    process.stdout.write(payload);
  }
}

console.log = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  write('[' + Date.now() + ']');
  args.map(function (arg) {
    if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object') {
      write((0, _util.inspect)(arg, { colors: true }));
      return;
    }
    write(arg + ' ');
  });
  write('\n');
};

var EditorExample = (0, _autobindDecorator2.default)(_class = function (_Component) {
  _inherits(EditorExample, _Component);

  function EditorExample() {
    _classCallCheck(this, EditorExample);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(EditorExample).apply(this, arguments));
  }

  _createClass(EditorExample, [{
    key: 'saveNode',
    value: function saveNode(ref) {
      this.node = ref;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.node.open(__filename).done();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_.Editor, _extends({}, this.props, { ref: this.saveNode }));
    }
  }]);

  return EditorExample;
}(_react.Component)) || _class;

exports.default = EditorExample;


var screen = new _blessed2.default.Screen({
  handleUncaughtExceptions: false,
  log: 'debug.log'
});

screen.key(['C-q', 'C-c'], function () {
  screen.destroy();
  process.exit(0);
});

global.screen = screen;

var props = {
  gutter: {
    hidden: false,
    width: 4,
    style: {
      bg: 'transparent',
      fg: 'grey'
    },
    activeStyle: {
      bg: 'transparent',
      fg: 'white'
    }
  }
};

try {
  (0, _reactBlessed.render)(_react2.default.createElement(EditorExample, props), screen);
} catch (error) {
  screen.destroy();
  console.error(error);
  throw error;
}