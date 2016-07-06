"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minus = minus;
function minus(offset) {
  return function (index) {
    return index - offset + 1;
  };
}

exports.default = minus;