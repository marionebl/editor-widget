#!/usr/bin/env node
'use strict';

var _highlight = require('highlight.js');

var _highlight2 = _interopRequireDefault(_highlight);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _slapUtil = require('slap-util');

var _slapUtil2 = _interopRequireDefault(_slapUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_highlight2.default.configure({ classPrefix: '' });

function highlight(text, language) {
  if (language === false) return [];

  var highlighted;
  if (language) {
    try {
      highlighted = _highlight2.default.highlight(language, text, true);
    } catch (e) {}
  }
  if (!highlighted) highlighted = _highlight2.default.highlightAuto(text);

  var $ = _cheerio2.default.load(highlighted.value);
  var ranges = [];
  do {
    var lastElCount = elCount;
    var elCount = $('*:not(:has(*))').replaceWith(function () {
      var $el = $(this);
      var text = '';[this].concat($el.parents().get(), [$.root()]).reverse().reduce(function (parent, el) {
        $(parent).contents().each(function () {
          var $sibling = $(this);
          if ($sibling.is(el)) return false;
          text += $sibling.text();
        });
        return el;
      });
      var lines = _slapUtil2.default.text.splitLines(text);
      var linesPlusEl = _slapUtil2.default.text.splitLines(text + $el.text());
      ranges.push({
        range: [[lines.length - 1, lines[lines.length - 1].length], [linesPlusEl.length - 1, linesPlusEl[linesPlusEl.length - 1].length]],
        properties: {
          type: 'syntax',
          syntax: ($el.attr('class') || '').match(/\S+/g) || []
        }
      });
      return $el.text();
    }).length;
  } while (lastElCount !== elCount);

  return ranges;
}

process.on('message', function (message) {
  switch (message.type) {
    case 'highlight':
      process.send({
        ranges: highlight(message.text, message.language),
        revision: message.revision,
        bucket: message.bucket
      });
      break;
    case 'logger':
      _slapUtil2.default.logger(message.options);break;
  }
});