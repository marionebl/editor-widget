'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Editor2 = require('./Editor');

var _Editor3 = _interopRequireDefault(_Editor2);

var _opts = require('./opts');

var _opts2 = _interopRequireDefault(_opts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = function (_Editor) {
  _inherits(Field, _Editor);

  function Field() {
    _classCallCheck(this, Field);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Field).apply(this, arguments));
  }

  _createClass(Field, [{
    key: 'submit',
    value: function submit(value) {
      this.emit('submit', value);
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.emit('cancel');
    }
  }, {
    key: 'onKeypress',
    value: function onKeypress(ch, key) {
      var self = this;
      switch (self.resolveBinding(key)) {
        case 'submit':
          self.submit(self.textBuf.getText());return false;
        case 'cancel':
          self.cancel();return false;
      }
      return _get(Object.getPrototypeOf(Field.prototype), 'onKeypress', this).call(this, ch, key);
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return _lodash2.default.merge({}, _Editor3.default.defaultProps, {
        height: 1,
        multiLine: false
      }, _opts2.default.field);
    }
  }]);

  return Field;
}(_Editor3.default);

exports.default = Field;