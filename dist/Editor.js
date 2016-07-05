'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _textBuffer = require('text-buffer');

var _textBuffer2 = _interopRequireDefault(_textBuffer);

var _point = require('text-buffer/lib/point');

var _point2 = _interopRequireDefault(_point);

var _range = require('text-buffer/lib/range');

var _range2 = _interopRequireDefault(_range);

var _baseWidget = require('base-widget');

var _baseWidget2 = _interopRequireDefault(_baseWidget);

var _slapUtil = require('slap-util');

var _slapUtil2 = _interopRequireDefault(_slapUtil);

var _word = require('./word');

var _word2 = _interopRequireDefault(_word);

var _opts = require('./opts');

var _opts2 = _interopRequireDefault(_opts);

var _client = require('./highlight/client');

var _client2 = _interopRequireDefault(_client);

var _Gutter = require('./Gutter');

var _Gutter2 = _interopRequireDefault(_Gutter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fs = _bluebird2.default.promisifyAll(require('fs'));
var clipboard = _bluebird2.default.promisifyAll(require('copy-paste'));

var Editor = function (_Component) {
  _inherits(Editor, _Component);

  _createClass(Editor, [{
    key: 'getInitialState',
    value: function getInitialState() {
      return {
        insertMode: true,
        language: false,
        readOnly: false,
        highlight: { ranges: [], revision: 0, bucket: _client2.default.getBucket() }
      };
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return _lodash2.default.merge({
        multiLine: true,
        clickable: true,
        keyable: true
      }, _opts2.default.editor);
    }
  }]);

  function Editor(props) {
    _classCallCheck(this, Editor);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Editor).call(this, props));

    _this.state = _this.getInitialState(); // only happens automatically with React.createClass, not JS classes

    _this.textBuf = new _textBuffer2.default({ encoding: _this.props.defaultEncoding });
    _this.textBuf.loadSync();
    if (_this.props.children) _this.textBuf.setText(_this.props.children);

    _this.selection = _this.textBuf.markPosition(new _point2.default(0, 0), { type: 'selection', invalidate: 'never' });
    _this.scroll = new _point2.default(0, 0);
    _this.updatePreferredX = true;

    _this._initHighlighting();
    return _this;
  }

  _createClass(Editor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this;
      var root = self.refs.root;
      root.focusable = true; // for BaseWidget#focusNext
      self._updateCursor();

      self.textBuf.onDidChange(function () {
        self.forceUpdate();
      });
      self.textBuf.onDidChangePath(function () {
        self.setState({ language: (0, _path.extname)(self.textBuf.getPath()).slice(1) });
      });

      var selection = self.selection;
      selection.onDidChange(function () {
        var cursor = self.visiblePos(selection.getHeadPosition());
        if (self.updatePreferredX) self.preferredCursorX = cursor.column; // preferred X when moving vertically
        self._markMatches();
        self.clipScroll([cursor]);
      });

      _baseWidget2.default.prototype._initHandlers.apply(root, arguments);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(props, state) {
      var self = this;
      self._updateCursor();

      self.destroyMarkers({ type: 'syntax' });
      if (state) state.highlight.ranges.forEach(function (range) {
        self.textBuf.markRange(range.range, range.properties);
      });
    }
  }, {
    key: '_requestHighlight',
    value: function _requestHighlight() {
      if (this.props.highlight) {
        var highlight = this.state.highlight;
        highlight.revision++;
        Editor.highlightClient.call('send', {
          type: 'highlight',
          text: this.textBuf.getText(),
          language: this.state.language,
          revision: highlight.revision,
          bucket: highlight.bucket
        }).done();
      }
    }
  }, {
    key: '_initHighlighting',
    value: function _initHighlighting() {
      var self = this;

      if (!Editor.count++) Editor.highlightClient = (0, _client2.default)().tap(function (client) {
        var loggerOpts = self.props.logger;
        if (loggerOpts) client.send({ type: 'logger', options: loggerOpts });
      });

      Editor.highlightClient.done(function (client) {
        self.textBuf.onDidChange(function () {
          self._requestHighlight();
        });
        client.once('message', function handleHighlight(highlight) {
          if (_baseWidget2.default.prototype.isAttached.call(self.refs.root)) client.once('message', handleHighlight);
          if (highlight.bucket === self.state.highlight.bucket && highlight.revision >= self.state.highlight.revision) self.setState({ highlight: highlight });
        });
      });

      return self;
    }
  }, {
    key: 'open',
    value: function open(givenPath) {
      // Handles nonexistent paths
      var self = this;
      return Editor.getOpenParams(givenPath).tap(function (params) {
        return self.textBuf.setPath(params.path);
      }).tap(function (params) {
        if (params.exists) return self.textBuf.load();
      }).tap(function (params) {
        self.selection.setHeadPosition(params.position);
      }).return(self);
    }
  }, {
    key: 'save',
    value: function save(path) {
      var self = this;
      var args = arguments;
      return _bluebird2.default.try(function () {
        return path ? self.textBuf.saveAs(_slapUtil2.default.resolvePath.apply(null, args)) : self.textBuf.save();
      }).then(function () {
        return self.textBuf.getPath();
      });
    }
  }, {
    key: 'lineWithEndingForRow',
    value: function lineWithEndingForRow(row) {
      return this.textBuf.lineForRow(row) + this.textBuf.lineEndingForRow(row);
    }
  }, {
    key: 'delete',
    value: function _delete(range) {
      this.textBuf.delete(range || this.selection.getRange());
      return this;
    }
  }, {
    key: '_getTabString',
    value: function _getTabString() {
      return this.props.buffer.useSpaces ? _lodash2.default.repeat(' ', this.props.buffer.tabSize) : '\t';
    }
  }, {
    key: 'indent',
    value: function indent(range, dedent) {
      var self = this;

      var tabString = self._getTabString();
      var indentRegex = new RegExp('^(\t| {0,' + self.props.buffer.tabSize + '})', 'g');
      var startDiff = 0,
          endDiff = 0;
      var linesRange = range.copy();
      linesRange.start.column = 0;
      linesRange.end.column = Infinity;
      self.textBuf.setTextInRange(linesRange, _slapUtil2.default.text.splitLines(self.textBuf.getTextInRange(linesRange)).map(function (line, i) {
        var result = !dedent ? tabString + line : line.replace(indentRegex, '');
        if (i === 0) startDiff = result.length - line.length;
        if (i === range.getRowCount() - 1) endDiff = result.length - line.length;
        return result;
      }).join(''));
      range = range.copy();
      range.start.column += startDiff;
      range.end.column += endDiff;
      self.selection.setRange(range);
      return self;
    }
  }, {
    key: 'visiblePos',
    value: function visiblePos(pos) {
      var self = this;
      if (pos instanceof _range2.default) return new _range2.default(self.visiblePos(pos.start), self.visiblePos(pos.end));
      pos = _point2.default.fromObject(pos, true);
      pos.column = self.lineWithEndingForRow(pos.row).slice(0, Math.max(pos.column, 0)).replace(Editor._tabRegExp, _lodash2.default.repeat('\t', self.props.buffer.tabSize)).length;
      return pos;
    }
  }, {
    key: 'realPos',
    value: function realPos(pos) {
      if (pos instanceof _range2.default) return new _range2.default(this.realPos(pos.start), this.realPos(pos.end));
      pos = _point2.default.fromObject(pos, true);
      pos.column = this.lineWithEndingForRow(this.textBuf.clipPosition(pos).row).replace(Editor._tabRegExp, _lodash2.default.repeat('\t', this.props.buffer.tabSize)).slice(0, Math.max(pos.column, 0)).replace(new RegExp('\\t{1,' + this.props.buffer.tabSize + '}', 'g'), '\t').length;
      return this.textBuf.clipPosition(pos);
    }
  }, {
    key: 'moveCursorVertical',
    value: function moveCursorVertical(count, paragraphs) {
      var selection = this.selection;
      var cursor = selection.getHeadPosition().copy();
      if (count < 0 && cursor.row === 0) {
        selection.setHeadPosition(new _point2.default(0, 0));
      } else if (count > 0 && cursor.row === this.textBuf.getLastRow()) {
        selection.setHeadPosition(new _point2.default(Infinity, Infinity));
      } else {
        if (paragraphs) {
          paragraphs = Math.abs(count);
          var direction = count ? paragraphs / count : 0;
          while (paragraphs--) {
            while (true) {
              cursor.row += direction;

              if (!(0 <= cursor.row && cursor.row < this.textBuf.getLastRow())) break;
              if (/^\s*$/g.test(this.textBuf.lineForRow(cursor.row))) break;
            }
          }
        } else {
          cursor.row += count;
        }

        var x = this.preferredCursorX;
        if (typeof x !== 'undefined') cursor.column = this.realPos(new _point2.default(cursor.row, x)).column;
        this.updatePreferredX = false;
        selection.setHeadPosition(cursor);
        this.updatePreferredX = true;
      }

      return this;
    }
  }, {
    key: 'moveCursorHorizontal',
    value: function moveCursorHorizontal(count, words) {
      var selection = this.selection;

      if (words) {
        words = Math.abs(count);
        var direction = words / count;
        while (words--) {
          var cursor = selection.getHeadPosition();
          var line = this.textBuf.lineForRow(cursor.row);
          var wordMatch = _word2.default[direction === -1 ? 'prev' : 'current'](line, cursor.column);
          this.moveCursorHorizontal(direction * Math.max(1, {
            '-1': cursor.column - (wordMatch ? wordMatch.index : 0),
            '1': (wordMatch ? wordMatch.index + wordMatch[0].length : line.length) - cursor.column
          }[direction]));
        }
      } else {
        var cursor = selection.getHeadPosition().copy();
        while (true) {
          if (-count > cursor.column) {
            // Up a line
            count += cursor.column + 1;
            if (cursor.row > 0) {
              cursor.row -= 1;
              cursor.column = this.textBuf.lineForRow(cursor.row).length;
            }
          } else {
            var restOfLineLength = this.textBuf.lineForRow(cursor.row).length - cursor.column;
            if (count > restOfLineLength) {
              // Down a line
              count -= restOfLineLength + 1;
              if (cursor.row < this.textBuf.getLastRow()) {
                cursor.column = 0;
                cursor.row += 1;
              }
            } else {
              // Same line
              cursor.column += count;
              selection.setHeadPosition(cursor);
              break;
            }
          }
        }
      }

      return this;
    }
  }, {
    key: 'copy',
    value: function copy() {
      var text = this.textBuf.getTextInRange(this.selection.getRange());
      if (!text) return _bluebird2.default.resolve(this);
      var screen = this.screen;
      if (screen) {
        screen.data.clipboard = text;
        screen.copyToClipboard(text);
      }
      return clipboard.copyAsync(text).catch(function (err) {
        _slapUtil2.default.logger.warn("Editor#copy", err);
      }).tap(function () {
        _slapUtil2.default.logger.debug('copied ' + text.length + ' characters');
      }).return(this);
    }
  }, {
    key: 'paste',
    value: function paste() {
      var self = this;
      var selection = self.selection;
      return clipboard.pasteAsync().catch(function (err) {
        _slapUtil2.default.logger.warn("Editor#paste", err);
      }).then(function (text) {
        text = text || self.screen.data.clipboard;
        if (typeof text === 'string') {
          self.textBuf.setTextInRange(selection.getRange(), text);
          selection.reversed = false;
          selection.clearTail();
          _slapUtil2.default.logger.debug('pasted ' + text.length + ' characters');
        }
        return self;
      });
    }
  }, {
    key: 'matchingBracket',
    value: function matchingBracket(pos) {
      pos = pos || this.selection.getHeadPosition();
      var bracket = (this.lineWithEndingForRow(pos.row)[pos.column] || '').match(Editor._bracketsRegExp);
      if (!bracket) return;
      var start = !!bracket[1];
      var _half = (bracket.length - 3) / 2 + 1;
      function oppositeBracketMatchIndex(bracketMatch) {
        var matchIndex;
        bracketMatch.some(function (match, i) {
          if ([0, 1, _half + 1].indexOf(i) === -1 && match) {
            matchIndex = i + _half * (start ? 1 : -1);
            return true;
          }
        });
        return matchIndex;
      }

      var lines = _slapUtil2.default.text.splitLines(this.textBuf.getTextInRange(start ? new _range2.default(pos, new _point2.default(Infinity, Infinity)) : new _range2.default(new _point2.default(0, 0), new _point2.default(pos.row, pos.column + 1))));

      if (!start) lines.reverse();

      var matches = [];
      var result = false;
      lines.some(function (line, row) {
        var column = start ? -1 : Infinity;
        while (true) {
          column = start ? _slapUtil2.default.text.regExpIndexOf(line, Editor._bracketsRegExp, column + 1) : _slapUtil2.default.text.regExpLastIndexOf(line.slice(0, column), Editor._bracketsRegExp);
          if (column === -1) break;
          var match = line[column].match(Editor._bracketsRegExp);
          if (!!match[1] === start) {
            matches.push(match);
          } else {
            var isOppositeBracket = !!match[oppositeBracketMatchIndex(matches.pop())];
            if (!matches.length || !isOppositeBracket) {
              result = {
                column: column + (start && row === 0 && pos.column),
                row: pos.row + (start ? row : -row),
                match: isOppositeBracket
              };
              return true;
            }
          }
        }
      });
      return result;
    }
  }, {
    key: 'onKeypress',
    value: function onKeypress(ch, key) {
      var self = this;
      var state = self.state;
      var selection = self.selection;
      var selectionRange = selection.getRange().copy();
      var binding = _baseWidget2.default.prototype.resolveBinding.call({ options: self.props }, key);
      if (self.props.multiLine && binding === 'indent' && key.full === 'tab' && selectionRange.isSingleLine()) binding = false;

      if (binding && ['go', 'select', 'delete'].some(function (action) {
        if (binding.indexOf(action) === 0) {
          if (action !== 'go') selection.plantTail();
          var directionDistance = binding.slice(action.length);
          return [{ name: 'All' }, { name: 'MatchingBracket' }, { name: 'Left', axis: 'horizontal', direction: -1 }, { name: 'Right', axis: 'horizontal', direction: 1 }, { name: 'Up', axis: 'vertical', direction: -1 }, { name: 'Down', axis: 'vertical', direction: 1 }].some(function (direction) {
            if (directionDistance.indexOf(direction.name) === 0) {
              var moved = true;
              var startSelectionHead = selection.getHeadPosition();

              if (direction.name === 'All') {
                selection.setRange(self.textBuf.getRange());
              } else if (direction.name === 'MatchingBracket') {
                var matchingBracket = self.matchingBracket();
                if (matchingBracket) selection.setHeadPosition(matchingBracket);else moved = false;
              } else {
                // } else if ('direction' in direction) {
                var selectionDirection = -(!selection.getRange().isEmpty() && selection.isReversed() * 2 - 1);
                if (!(action === 'delete' && (selectionDirection || state.readOnly))) {
                  var distance = directionDistance.slice(direction.name.length);
                  switch (direction.axis) {
                    case 'horizontal':
                      switch (distance) {
                        case '':
                          if (action === 'go' && direction.direction === -selectionDirection) {
                            selection.setHeadPosition(selection.getTailPosition());
                          } else {
                            self.moveCursorHorizontal(direction.direction);
                          }
                          break;
                        case 'Word':
                          self.moveCursorHorizontal(direction.direction, true);break;
                        case 'Infinity':
                          var cursor = selection.getHeadPosition();
                          var firstNonWhiteSpaceX = (self.lineWithEndingForRow(cursor.row).match(/^\s*/) || [''])[0].length;
                          selection.setHeadPosition(new _point2.default(cursor.row, direction.direction === -1 ? cursor.column === firstNonWhiteSpaceX ? 0 : firstNonWhiteSpaceX : Infinity));
                          break;
                        default:
                          moved = false;break;
                      }
                      break;
                    case 'vertical':
                      switch (distance) {
                        case '':
                          self.moveCursorVertical(direction.direction);break;
                        case 'Paragraph':
                          self.moveCursorVertical(direction.direction, true);break;
                        case 'Page':
                          self.moveCursorVertical(direction.direction * self.props.pageLines);break;
                        case 'Infinity':
                          selection.setHeadPosition(direction.direction === -1 ? new _point2.default(0, 0) : new _point2.default(Infinity, Infinity));
                          break;
                        default:
                          moved = false;break;
                      }
                  }
                }
              }
              if (moved) {
                if (action === 'go') selection.clearTail();
                if (action === 'delete' && !state.readOnly) self.delete();
                return true;
              }
            }
          });
        }
      })) {
        return false;
      } else {
        switch (binding) {
          case 'selectLine':
          case 'deleteLine':
            var cursor = selection.getHeadPosition();
            selection.setRange(new _range2.default(cursor.row === self.textBuf.getLineCount() - 1 ? new _point2.default(cursor.row - 1, Infinity) : new _point2.default(cursor.row, 0), new _point2.default(cursor.row + 1, 0)));
            if (binding === 'deleteLine') self.delete();
            selection.setHeadPosition(cursor);
            return false;
          case 'indent':
          case 'dedent':
            if (!self.props.multiLine) return;
            self.indent(selectionRange, binding === 'dedent');return false;
          case 'duplicateLine':
            var cursor = selection.getHeadPosition();
            var line = self.lineWithEndingForRow(cursor.row);
            if (line === self.textBuf.lineForRow(cursor.row)) line = '\n' + line;
            var nextLinePos = new _point2.default(cursor.row + 1, 0);
            self.textBuf.setTextInRange(new _range2.default(nextLinePos, nextLinePos), line);
            return false;
          case 'undo':
            self.textBuf.undo();return false;
          case 'redo':
            self.textBuf.redo();return false;
          case 'copy':
          case 'cut':
            self.copy().done();
            if (binding === 'cut') self.delete();
            return false;
          case 'paste':
            self.paste().done();return false;
          case 'toggleInsertMode':
            self.setState({ insertMode: !state.insertMode });return false;
          default:
            if (!binding && !key.ctrl && ch) {
              var enterPressed = key.name === 'return' || key.name === 'linefeed';
              var cursor = selection.getHeadPosition();
              var line = self.lineWithEndingForRow(cursor.row);
              if (enterPressed) {
                if (!self.props.multiLine) return;
                ch = '\n' + line.slice(0, cursor.column).match(/^( |\t)*/)[0];
              } else if (key.name === 'enter') {
                return; // blessed remaps keys -- ch and key.sequence here are '\r'
              } else if (ch === '\t') {
                ch = self._getTabString();
              } else if (ch === '\x1b') {
                // escape
                return;
              }

              if (!state.readOnly) {
                if (selectionRange.isEmpty() && !state.insertMode && !enterPressed) selectionRange.end.column++;
                selection.setRange(self.textBuf.setTextInRange(selectionRange, ch));
                selection.reversed = false;
                selection.clearTail();
              }
              return false;
            }
            break;
        }
      }
    }
  }, {
    key: 'onMouse',
    value: function onMouse(mouseData) {
      var self = this;
      process.nextTick(function () {
        self._lastMouseData = mouseData;
      });
      if (mouseData.action === 'wheeldown' || mouseData.action === 'wheelup') {
        self.scroll.row += {
          wheelup: -1,
          wheeldown: 1
        }[mouseData.action] * self.props.pageLines;
        self.clipScroll();
        return;
      }

      var mouse = self.realPos(new _point2.default(mouseData.y, mouseData.x).translate(_baseWidget2.default.prototype.pos.call(self.refs.buffer).negate()).translate(self.scroll));

      var newSelection = self.selection.copy();
      if (mouseData.action === 'mouseup') self.lastClick = { mouse: mouse, time: Date.now() };
      if (mouseData.action === 'mousedown') {
        var lastClick = self.lastClick;
        if (lastClick && mouse.isEqual(lastClick.mouse) && lastClick.time + self.props.doubleClickDuration > Date.now()) {
          self.lastClick = null;
          var line = self.textBuf.lineForRow(mouse.row);
          var startX = mouse.column;
          var endX = mouse.column + 1;
          var prev = _word2.default.prev(line, mouse.column);
          var current = _word2.default.current(line, mouse.column);
          if (current) {
            if (prev && current.index < prev.index + prev[0].length) {
              startX = prev.index;
              endX = prev.index + prev[0].length;
            } else if (current.index <= mouse.column && mouse.column < current.index + current[0].length) {
              startX = current.index;
              endX = current.index + current[0].length;
            }
          }
          newSelection.setRange(new _range2.default(new _point2.default(mouse.row, startX), new _point2.default(mouse.row, endX)));
        } else {
          if ((self._lastMouseData || {}).action !== 'mousedown' && !mouseData.shift) newSelection.clearTail();
          newSelection.setHeadPosition(mouse);
          newSelection.plantTail();
        }
      }
      self.selection.setRange(newSelection.getRange(), { reversed: newSelection.isReversed() });
      newSelection.destroy();
    }
  }, {
    key: 'onDetach',
    value: function onDetach() {
      this.textBuf.destroy();
      this._updateCursor();

      if (--Editor.count) return;
      Editor.highlightClient.tap(function (client) {
        if (!client) return;
        client.dontRespawn = true;
        client.kill();
      }).done();
    }
  }, {
    key: 'clipScroll',
    value: function clipScroll(poss) {
      var self = this;

      var size = _baseWidget2.default.prototype.size.call(self.refs.buffer);
      var scroll = (poss || []).reduce(function (scroll, pos) {
        var cursorPadding = self.props.buffer.cursorPadding || {};
        var minScroll = pos.translate(size.negate()).translate(new _point2.default((cursorPadding.right || 0) + 1, (cursorPadding.bottom || 0) + 1));
        var maxScroll = pos.translate(new _point2.default(-cursorPadding.left || 0, -cursorPadding.top || 0));

        return new _point2.default(Math.min(Math.max(scroll.row, minScroll.row), maxScroll.row), Math.min(Math.max(scroll.column, minScroll.column), maxScroll.column));
      }, self.scroll);

      self.scroll = new _point2.default(Math.max(0, Math.min(scroll.row, self.textBuf.getLineCount() - size.row)), Math.max(0, scroll.column));
      self.forceUpdate();

      return self;
    }
  }, {
    key: '_markMatches',
    value: function _markMatches() {
      var self = this;
      var selection = self.selection.getRange();
      var selectionText = self.textBuf.getTextInRange(selection);
      var line = self.lineWithEndingForRow(selection.end.row);

      self.destroyMarkers({ type: 'match' });
      if (selection.isSingleLine() && selectionText.match(/^[\w.-]+$/) && (line[selection.start.column - 1] || ' ').match(/\W/) && (line[selection.end.column] || ' ').match(/\W/)) {
        self.textBuf.scan(new RegExp('\\b' + _lodash2.default.escapeRegExp(selectionText) + '\\b', 'g'), function (match) {
          self.textBuf.markRange(match.range, { type: 'match' });
        });
      }
      return self;
    }
  }, {
    key: 'destroyMarkers',
    value: function destroyMarkers(params) {
      _lodash2.default.invoke(this.textBuf.findMarkers(params), 'destroy');
      return this;
    }
  }, {
    key: '_updateCursor',
    value: function _updateCursor() {
      var self = this;
      var screen = self.screen;
      if (!screen) return;
      var program = screen.program;
      var buffer = self.refs.buffer;
      if (!buffer.visible) {
        program.hideCursor();
        return;
      }
      var scrollCursor = self.visiblePos(self.selection.getHeadPosition()).translate(self.scroll.negate());
      if (_baseWidget2.default.prototype.hasFocus.call(self.refs.root) && new _range2.default(new _point2.default(0, 0), _baseWidget2.default.prototype.size.call(buffer).translate(new _point2.default(-1, -1))).containsPoint(scrollCursor)) {
        var screenCursor = scrollCursor.translate(_baseWidget2.default.prototype.pos.call(buffer));
        program.move(screenCursor.column, screenCursor.row);
        program.showCursor();
      } else {
        program.hideCursor();
      }
    }
  }, {
    key: '_renderableTabString',
    value: function _renderableTabString(match) {
      return !this.props.buffer.visibleWhiteSpace ? _lodash2.default.repeat(' ', this.props.buffer.tabSize * match.length) : _slapUtil2.default.markup(_lodash2.default.repeat(_lodash2.default.repeat('─', this.props.buffer.tabSize - 1) + (this.props.buffer.tabSize ? '╴' : ''), match.length), this.props.style.whiteSpace);
    }
  }, {
    key: '_renderableSpace',
    value: function _renderableSpace(match) {
      return !this.props.buffer.visibleWhiteSpace ? match : _slapUtil2.default.markup(_lodash2.default.repeat('·', match.length), this.props.style.whiteSpace);
    }
  }, {
    key: '_renderableLineEnding',
    value: function _renderableLineEnding(lineEnding) {
      return !this.props.buffer.visibleLineEndings ? '' : _slapUtil2.default.markup(lineEnding.replace(/\n/g, '\\n').replace(/\r/g, '\\r'), this.props.style.whiteSpace);
    }
  }, {
    key: 'render',
    value: function render() {
      var self = this;
      var props = self.props;
      var gutter = props.gutter;


      var size = self.refs.buffer ? _baseWidget2.default.prototype.size.call(self.refs.buffer) : new _point2.default(1024, 1024);

      var gutterWidth = gutter.visible === false ? 0 : gutter.width;

      var scroll = self.scroll;
      var selection = self.selection;
      var selectionRange = selection.getRange();
      var matchingBracket = self.matchingBracket(selection.getHeadPosition());
      var cursorOnBracket = selectionRange.isEmpty() && matchingBracket !== undefined;
      var visibleSelection = self.visiblePos(selectionRange);
      var visibleCursor = visibleSelection[selection.reversed ? 'start' : 'end'];
      var visibleMatchingBracket = selectionRange.isEmpty() && matchingBracket && self.visiblePos(matchingBracket);

      var style = props.style;
      var defaultStyle = style.default;
      var selectionStyle = style.selection;
      var matchStyle = style.match;
      var bracketStyle = matchingBracket && matchingBracket.match ? style.matchingBracket : style.mismatchedBracket;

      var currentLineStyle = props.gutter.style.currentLine;

      var lines = _slapUtil2.default.text.splitLines(_baseWidget2.default.blessed.escape(self.textBuf.getTextInRange({
        start: new _point2.default(scroll.row, 0),
        end: scroll.translate(size)
      })));

      return _react2.default.createElement(
        'element',
        { ref: 'root',
          onKeypress: self.onKeypress.bind(self), keyable: this.props.keyable,
          onMouse: self.onMouse.bind(self), clickable: this.props.clickable,
          onDetach: self.onDetach.bind(self) },
        gutter.hidden === false && _react2.default.createElement(_Gutter2.default, _extends({}, gutter, {
          width: gutterWidth,
          offset: scroll.row,
          active: visibleCursor.row,
          lines: lines.length
        })),
        _react2.default.createElement(
          'box',
          _extends({ ref: 'buffer' }, props.buffer, {
            left: gutterWidth,
            wrap: false,
            tags: true }),
          lines.map(function (line, row) {
            var column = scroll.column;
            row += scroll.row;
            var renderableLineEnding = self._renderableLineEnding((line.match(_slapUtil2.default.text._lineRegExp) || [''])[0]);
            line = line.replace(/\t+/g, self._renderableTabString.bind(self)).replace(/ +/g, self._renderableSpace.bind(self)).replace(_slapUtil2.default.text._lineRegExp, renderableLineEnding).replace(Editor._nonprintableRegExp, '�');
            line = _slapUtil2.default.markup.parse(line).slice(column, column + size.column).push(_lodash2.default.repeat(' ', size.column)).tag(defaultStyle);
            self.textBuf.findMarkers({ intersectsRow: row }).sort(Editor.markerCmp).forEach(function (marker) {
              var range = self.visiblePos(marker.getRange());
              if (range.intersectsRow(row)) {
                var markerStyle;
                switch (marker.properties.type) {
                  case 'selection':
                    markerStyle = selectionStyle;break;
                  case 'match':case 'findMatch':
                    markerStyle = matchStyle;break;
                  case 'syntax':
                    markerStyle = marker.properties.syntax.map(function (syntax) {
                      if (!(syntax in style)) _slapUtil2.default.logger.debug("unstyled syntax:", syntax);
                      return style[syntax] || '';
                    }).join('');break;
                  default:
                    throw new Error("unknown marker: " + marker.properties.type);
                }
                line = _slapUtil2.default.markup(line, markerStyle, row === range.start.row ? range.start.column - column : 0, row === range.end.row ? range.end.column - column : Infinity);
              }
            });
            if (cursorOnBracket && row === visibleCursor.row) {
              line = _slapUtil2.default.markup(line, bracketStyle, visibleCursor.column - column, visibleCursor.column - column + 1);
            }
            if (visibleMatchingBracket && row === visibleMatchingBracket.row) {
              line = _slapUtil2.default.markup(line, bracketStyle, visibleMatchingBracket.column - column, visibleMatchingBracket.column - column + 1);
            }
            return line + '{/}';
          }).join('\n')
        )
      );
    }
  }, {
    key: 'screen',
    get: function get() {
      return this.refs.root.screen;
    }
  }], [{
    key: 'parseCoordinate',
    value: function parseCoordinate(n) {
      return parseInt(n, 10) - 1 || 0;
    }
  }, {
    key: 'exists',
    value: function exists(givenPath) {
      return fs.openAsync(givenPath, 'r').then(function (fd) {
        return fs.closeAsync(fd);
      }).return(true).catch(function (err) {
        if (err.code !== 'ENOENT') throw err;
        return false;
      });
    }
  }, {
    key: 'getOpenParams',
    value: function getOpenParams(givenPath) {
      givenPath = _slapUtil2.default.resolvePath(givenPath);
      var baseParams = {
        path: givenPath,
        exists: false,
        position: new _point2.default(0, 0)
      };
      var match = givenPath.match(Editor.openRegExp); // always matches
      return [
      // if a path like file.c:3:8 is passed, see if `file.c:3:8` exists first,
      // then try `file.c:3` line 8, then `file.c` line 3 column 8
      baseParams, _lodash2.default.merge({}, baseParams, {
        path: match[1] + ':' + match[2],
        position: { row: Editor.parseCoordinate(match[3]) }
      }), _lodash2.default.merge({}, baseParams, {
        path: match[1],
        position: { row: Editor.parseCoordinate(match[2]), column: Editor.parseCoordinate(match[3]) }
      })].reduce(function (promise, params) {
        return promise.then(function (resultParams) {
          if ((resultParams || {}).exists) return resultParams;
          return Editor.exists(params.path).then(function (exists) {
            params.exists = exists;
            return params;
          });
        });
      }, _bluebird2.default.resolve());
    }
  }, {
    key: 'markerCmp',
    value: function markerCmp(a, b) {
      return Editor.MARKER_ORDER.indexOf(b.properties.type) - Editor.MARKER_ORDER.indexOf(a.properties.type);
    }
  }]);

  return Editor;
}(_react.Component);

exports.default = Editor;


_lodash2.default.merge(Editor, {
  count: 0,
  MARKER_ORDER: ['syntax', 'match', 'findMatch', 'selection'],
  // looks for path like /home/dan/file.c:3:8 but matches every string
  openRegExp: new RegExp(['^', '(.*?)', // path:   match[1] (like /home/dan/file.c)
  '(?:\\:(\\d+))?', // row:    match[2] (like 3, optional)
  '(?:\\:(\\d+))?', // column: match[3] (like 8, optional)
  '$'].join('')),
  _tabRegExp: /\t/g,
  _bracketsRegExp: /((\()|(\[)|(\{))|((\))|(\])|(\}))/,
  _nonprintableRegExp: /[\x00-\x1f]|\x7f/g
});