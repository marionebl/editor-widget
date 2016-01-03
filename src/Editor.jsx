'use strict'

import _ from 'lodash'
import React, {Component} from 'react'
import Promise from'bluebird'
import {extname} from 'path'
if (require('semver').lt(process.version, '4.0.0')) require('iconv-lite').extendNodeEncodings() // FIXME: destroy this abomination
import TextBuffer from 'text-buffer'
import Point from 'text-buffer/lib/point'
import Range from 'text-buffer/lib/range'

const fs = Promise.promisifyAll(require('fs'))
const clipboard = Promise.promisifyAll(require('copy-paste'))

import util from 'slap-util'
import word from './word'
import editorWidgetOpts from './opts'
import highlightClient from './highlight/client'

import BaseWidget from 'base-widget'

export default class Editor extends Component {
  getInitialState () {
    return {
      insertMode: true,
      language: false,
      readOnly: false,
      highlight: {ranges: [], revision: 0, bucket: highlightClient.getBucket()}
    }
  }

  static get defaultProps () {
    return _.merge({multiLine: true}, editorWidgetOpts.editor)
  }

  constructor (props) {
    super(props)
    this.state = this.getInitialState() // only happens automatically with React.createClass, not JS classes

    this.textBuf = new TextBuffer({encoding: this.props.defaultEncoding})
    this.textBuf.loadSync()
    if (this.props.children) this.textBuf.setText(this.props.children)

    this.selection = this.textBuf.markPosition(new Point(0, 0), {type: 'selection', invalidate: 'never'})
    this.scroll = new Point(0, 0)
    this.updatePreferredX = true

    this._initHighlighting()
  }

  componentDidMount () {
    var self = this
    var root = self.refs.root
    root.focusable = true // for BaseWidget#focusNext
    self._updateCursor()

    self.textBuf.onDidChange(() => { self.forceUpdate() })
    self.textBuf.onDidChangePath(() => { self.setState({language: extname(self.textBuf.getPath()).slice(1)}) })

    var selection = self.selection
    selection.onDidChange(() => {
      var cursor = self.visiblePos(selection.getHeadPosition())
      if (self.updatePreferredX) self.preferredCursorX = cursor.column // preferred X when moving vertically
      self._markMatches()
      self.clipScroll([cursor])
    })

    BaseWidget.prototype._initHandlers.apply(root, arguments)
  }

  componentWillUpdate (props, state) {
    var self = this
    self._updateCursor()

    self.destroyMarkers({type: 'syntax'})
    if (state) state.highlight.ranges.forEach(range => {
      self.textBuf.markRange(range.range, range.properties)
    })
  }

  _requestHighlight () {
    if (this.props.highlight) {
      var highlight = this.state.highlight
      highlight.revision++
      Editor.highlightClient.call('send', {
        type: 'highlight',
        text: this.textBuf.getText(),
        language: this.state.language,
        revision: highlight.revision,
        bucket: highlight.bucket
      }).done()
    }
  }

  _initHighlighting () {
    var self = this

    if (!Editor.count++) Editor.highlightClient = highlightClient().tap(client => {
      var loggerOpts = self.props.logger
      if (loggerOpts) client.send({type: 'logger', options: loggerOpts})
    })

    Editor.highlightClient.done(client => {
      self.textBuf.onDidChange(() => { self._requestHighlight() })
      client.once('message', function handleHighlight (highlight) {
        if (BaseWidget.prototype.isAttached.call(self.refs.root)) client.once('message', handleHighlight)
        if (
          highlight.bucket === self.state.highlight.bucket &&
          highlight.revision >= self.state.highlight.revision) self.setState({highlight})
      })
    })

    return self
  }

  get screen () { return this.refs.root.screen }

  static parseCoordinate (n) { return (parseInt(n, 10) - 1) || 0 }
  static exists (givenPath) {
    return fs.openAsync(givenPath, 'r')
      .then(fd => fs.closeAsync(fd))
      .return(true)
      .catch(err => {
        if (err.code !== 'ENOENT') throw err
        return false
      })
  }
  static getOpenParams (givenPath) {
    givenPath = util.resolvePath(givenPath)
    var baseParams = {
      path: givenPath,
      exists: false,
      position: new Point(0, 0)
    }
    var match = givenPath.match(Editor.openRegExp) // always matches
    return [
      // if a path like file.c:3:8 is passed, see if `file.c:3:8` exists first,
      // then try `file.c:3` line 8, then `file.c` line 3 column 8
      baseParams,
      _.merge({}, baseParams, {
        path: `${match[1]}:${match[2]}`,
        position: {row: Editor.parseCoordinate(match[3])}
      }),
      _.merge({}, baseParams, {
        path: match[1],
        position: {row: Editor.parseCoordinate(match[2]), column: Editor.parseCoordinate(match[3])}
      })
    ].reduce((promise, params) => {
      return promise.then(resultParams => {
        if ((resultParams || {}).exists) return resultParams
        return Editor.exists(params.path).then(exists => {
          params.exists = exists
          return params
        })
      })
    }, Promise.resolve())
  }
  open (givenPath) {
    // Handles nonexistent paths
    var self = this
    return Editor.getOpenParams(givenPath)
      .tap((params) => self.textBuf.setPath(params.path))
      .tap((params) => { if (params.exists) return self.textBuf.load() })
      .tap((params) => { self.selection.setHeadPosition(params.position) })
      .return(self)
  }
  save (path) {
    var self = this
    var args = arguments
    return Promise
      .try(() => path
        ? self.textBuf.saveAs(util.resolvePath.apply(null, args))
        : self.textBuf.save())
      .then(() => self.textBuf.getPath())
  }

  lineWithEndingForRow (row) {
    return this.textBuf.lineForRow(row) + this.textBuf.lineEndingForRow(row)
  }

  delete (range) {
    this.textBuf.delete(range || this.selection.getRange())
    return this
  }

  _getTabString () {
    return this.props.buffer.useSpaces
      ? _.repeat(' ', this.props.buffer.tabSize)
      : '\t'
  }


  indent (range, dedent) {
    var self = this

    var tabString = self._getTabString()
    var indentRegex = new RegExp(`^(\t| {0,${self.props.buffer.tabSize}})`, 'g')
    var startDiff = 0, endDiff = 0
    var linesRange = range.copy()
    linesRange.start.column = 0
    linesRange.end.column = Infinity
    self.textBuf.setTextInRange(linesRange, util.text.splitLines(self.textBuf.getTextInRange(linesRange))
      .map((line, i) => {
        var result = !dedent
          ? tabString + line
          : line.replace(indentRegex, '')
        if (i === 0)                       startDiff = result.length - line.length
        if (i === range.getRowCount() - 1) endDiff   = result.length - line.length
        return result
      })
      .join(''))
    range = range.copy()
    range.start.column += startDiff
    range.end.column += endDiff
    self.selection.setRange(range)
    return self
  }

  visiblePos (pos) {
    var self = this
    if (pos instanceof Range) return new Range(self.visiblePos(pos.start), self.visiblePos(pos.end))
    pos = Point.fromObject(pos, true)
    pos.column = self.lineWithEndingForRow(pos.row)
      .slice(0, Math.max(pos.column, 0))
      .replace(Editor._tabRegExp, _.repeat('\t', self.props.buffer.tabSize))
      .length
    return pos
  }
  realPos (pos) {
    if (pos instanceof Range) return new Range(this.realPos(pos.start), this.realPos(pos.end))
    pos = Point.fromObject(pos, true)
    pos.column = this.lineWithEndingForRow(this.textBuf.clipPosition(pos).row)
      .replace(Editor._tabRegExp, _.repeat('\t', this.props.buffer.tabSize))
      .slice(0, Math.max(pos.column, 0))
      .replace(new RegExp(`\\t{1,${this.props.buffer.tabSize}}`, 'g'), '\t')
      .length
    return this.textBuf.clipPosition(pos)
  }

  moveCursorVertical (count, paragraphs) {
    var selection = this.selection
    var cursor = selection.getHeadPosition().copy()
    if (count < 0 && cursor.row === 0) {
      selection.setHeadPosition(new Point(0, 0))
    } else if (count > 0 && cursor.row === this.textBuf.getLastRow()) {
      selection.setHeadPosition(new Point(Infinity, Infinity))
    } else {
      if (paragraphs) {
        paragraphs = Math.abs(count)
        var direction = count ? paragraphs / count : 0
        while (paragraphs--) {
          while (true) {
            cursor.row += direction

            if (!(0 <= cursor.row && cursor.row < this.textBuf.getLastRow())) break
            if (/^\s*$/g.test(this.textBuf.lineForRow(cursor.row))) break
          }
        }
      } else {
        cursor.row += count
      }

      var x = this.preferredCursorX
      if (typeof x !== 'undefined') cursor.column = this.realPos(new Point(cursor.row, x)).column
      this.updatePreferredX = false
      selection.setHeadPosition(cursor)
      this.updatePreferredX = true
    }

    return this
  }
  moveCursorHorizontal (count, words) {
    var selection = this.selection

    if (words) {
      words = Math.abs(count)
      var direction = words / count
      while (words--) {
        var cursor = selection.getHeadPosition()
        var line = this.textBuf.lineForRow(cursor.row)
        var wordMatch = word[direction === -1 ? 'prev' : 'current'](line, cursor.column)
        this.moveCursorHorizontal(direction * Math.max(1, {
          '-1': cursor.column - (wordMatch ? wordMatch.index : 0),
          '1': (wordMatch ? wordMatch.index + wordMatch[0].length : line.length) - cursor.column
        }[direction]))
      }
    } else {
      var cursor = selection.getHeadPosition().copy()
      while (true) {
        if (-count > cursor.column) {
          // Up a line
          count += cursor.column + 1
          if (cursor.row > 0) {
            cursor.row -= 1
            cursor.column = this.textBuf.lineForRow(cursor.row).length
          }
        } else {
          var restOfLineLength = this.textBuf.lineForRow(cursor.row).length - cursor.column
          if (count > restOfLineLength) {
            // Down a line
            count -= restOfLineLength + 1
            if (cursor.row < this.textBuf.getLastRow()) {
              cursor.column = 0
              cursor.row += 1
            }
          } else {
            // Same line
            cursor.column += count
            selection.setHeadPosition(cursor)
            break
          }
        }
      }
    }

    return this
  }

  copy () {
    var text = this.textBuf.getTextInRange(this.selection.getRange())
    if (!text) return Promise.resolve(this)
    var screen = this.screen
    if (screen) {
      screen.data.clipboard = text
      screen.copyToClipboard(text)
    }
    return clipboard.copyAsync(text)
      .catch(err => { util.logger.warn("Editor#copy", err) })
      .tap(() => { util.logger.debug(`copied ${text.length} characters`) })
      .return(this)
  }
  paste () {
    var self = this
    var selection = self.selection
    return clipboard.pasteAsync()
      .catch(err => { util.logger.warn("Editor#paste", err) })
      .then(text => {
        text = text || self.screen.data.clipboard
        if (typeof text === 'string') {
          self.textBuf.setTextInRange(selection.getRange(), text)
          selection.reversed = false
          selection.clearTail()
          util.logger.debug(`pasted ${text.length} characters`)
        }
        return self
      })
  }

  matchingBracket (pos) {
    pos = pos || this.selection.getHeadPosition()
    var bracket = (this.lineWithEndingForRow(pos.row)[pos.column] || '').match(Editor._bracketsRegExp)
    if (!bracket) return
    var start = !!bracket[1]
    var _half = (bracket.length - 3)/2 + 1
    function oppositeBracketMatchIndex (bracketMatch) {
      var matchIndex
      bracketMatch.some((match, i) => {
        if ([0, 1, _half + 1].indexOf(i) === -1 && match) {
          matchIndex = i + _half*(start ? 1 : -1)
          return true
        }
      })
      return matchIndex
    }

    var lines = util.text.splitLines(this.textBuf.getTextInRange(start
      ? new Range(pos, new Point(Infinity, Infinity))
      : new Range(new Point(0, 0), new Point(pos.row, pos.column + 1))))

    if (!start) lines.reverse()

    var matches = []
    var result = false
    lines.some((line, row) => {
      var column = start ? -1 : Infinity
      while (true) {
        column = start
          ? util.text.regExpIndexOf(line, Editor._bracketsRegExp, column + 1)
          : util.text.regExpLastIndexOf(line.slice(0, column), Editor._bracketsRegExp)
        if (column === -1) break
        var match = line[column].match(Editor._bracketsRegExp)
        if (!!match[1] === start) {
          matches.push(match)
        } else {
          var isOppositeBracket = !!match[oppositeBracketMatchIndex(matches.pop())]
          if (!matches.length || !isOppositeBracket) {
            result = {
              column: column + (start && row === 0 && pos.column),
              row: pos.row + (start ? row : -row),
              match: isOppositeBracket
            }
            return true
          }
        }
      }
    })
    return result
  }

  onKeypress (ch, key) {
    var self = this
    var state = self.state
    var selection = self.selection
    var selectionRange = selection.getRange().copy()
    var binding = BaseWidget.prototype.resolveBinding.call({options: self.props}, key)
    if (self.props.multiLine
      && binding === 'indent'
      && key.full === 'tab'
      && selectionRange.isSingleLine()) binding = false

    if (binding && ['go', 'select', 'delete'].some(action => {
      if (binding.indexOf(action) === 0) {
        if (action !== 'go') selection.plantTail()
        var directionDistance = binding.slice(action.length)
        return [
          {name: 'All'},
          {name: 'MatchingBracket'},
          {name: 'Left', axis: 'horizontal', direction: -1},
          {name: 'Right', axis: 'horizontal', direction: 1},
          {name: 'Up', axis: 'vertical', direction: -1},
          {name: 'Down', axis: 'vertical', direction: 1}
        ].some(direction => {
          if (directionDistance.indexOf(direction.name) === 0) {
            var moved = true
            var startSelectionHead = selection.getHeadPosition()

            if (direction.name === 'All') {
              selection.setRange(self.textBuf.getRange())
            } else if (direction.name === 'MatchingBracket') {
              var matchingBracket = self.matchingBracket()
              if (matchingBracket) selection.setHeadPosition(matchingBracket)
              else moved = false
            } else { // } else if ('direction' in direction) {
              var selectionDirection = -(!selection.getRange().isEmpty() && selection.isReversed() * 2 - 1)
              if (!(action === 'delete' && (selectionDirection || state.readOnly))) {
                var distance = directionDistance.slice(direction.name.length)
                switch (direction.axis) {
                  case 'horizontal':
                    switch (distance) {
                      case '':
                        if (action === 'go' && direction.direction === -selectionDirection) {
                          selection.setHeadPosition(selection.getTailPosition())
                        } else {
                          self.moveCursorHorizontal(direction.direction)
                        }
                        break
                      case 'Word': self.moveCursorHorizontal(direction.direction, true); break
                      case 'Infinity':
                        var cursor = selection.getHeadPosition()
                        var firstNonWhiteSpaceX = (self.lineWithEndingForRow(cursor.row).match(/^\s*/) || [''])[0].length
                        selection.setHeadPosition(new Point(cursor.row, direction.direction === -1
                          ? cursor.column === firstNonWhiteSpaceX
                            ? 0
                            : firstNonWhiteSpaceX
                          : Infinity))
                        break
                      default: moved = false; break
                    }
                    break
                  case 'vertical':
                    switch (distance) {
                      case '': self.moveCursorVertical(direction.direction); break
                      case 'Paragraph': self.moveCursorVertical(direction.direction, true); break
                      case 'Page': self.moveCursorVertical(direction.direction * self.props.pageLines); break
                      case 'Infinity':
                        selection.setHeadPosition(direction.direction === -1
                          ? new Point(0, 0)
                          : new Point(Infinity, Infinity))
                        break
                      default: moved = false; break
                    }
                }
              }
            }
            if (moved) {
              if (action === 'go') selection.clearTail()
              if (action === 'delete' && !state.readOnly) self.delete()
              return true
            }
          }
        })
      }
    })) {
      return false
    } else {
      switch (binding) {
        case 'selectLine':
        case 'deleteLine':
          var cursor = selection.getHeadPosition()
          selection.setRange(new Range(
            cursor.row === self.textBuf.getLineCount() - 1
              ? new Point(cursor.row - 1, Infinity)
              : new Point(cursor.row, 0),
            new Point(cursor.row + 1, 0)))
          if (binding === 'deleteLine') self.delete()
          selection.setHeadPosition(cursor)
          return false
        case 'indent':
        case 'dedent':
          if (!self.props.multiLine) return
          self.indent(selectionRange, binding === 'dedent'); return false
        case 'duplicateLine':
          var cursor = selection.getHeadPosition()
          var line = self.lineWithEndingForRow(cursor.row)
          if (line === self.textBuf.lineForRow(cursor.row)) line = `\n${line}`
          var nextLinePos = new Point(cursor.row + 1, 0)
          self.textBuf.setTextInRange(new Range(nextLinePos, nextLinePos), line)
          return false
        case 'undo': self.textBuf.undo(); return false
        case 'redo': self.textBuf.redo(); return false
        case 'copy':
        case 'cut':
          self.copy().done()
          if (binding === 'cut') self.delete()
          return false
        case 'paste': self.paste().done(); return false
        case 'toggleInsertMode': self.setState({insertMode: !state.insertMode}); return false
        default:
          if (!binding && !key.ctrl && ch) {
            var enterPressed = key.name === 'return' || key.name === 'linefeed'
            var cursor = selection.getHeadPosition()
            var line = self.lineWithEndingForRow(cursor.row)
            if (enterPressed) {
              if (!self.props.multiLine) return
              ch = `\n${line.slice(0, cursor.column).match(/^( |\t)*/)[0]}`
            } else if (key.name === 'enter') {
              return // blessed remaps keys -- ch and key.sequence here are '\r'
            } else if (ch === '\t') {
              ch = self._getTabString()
            } else if (ch === '\x1b') { // escape
              return
            }

            if (!state.readOnly) {
              if (selectionRange.isEmpty() && !state.insertMode && !enterPressed) selectionRange.end.column++
              selection.setRange(self.textBuf.setTextInRange(selectionRange, ch))
              selection.reversed = false
              selection.clearTail()
            }
            return false
          }
          break
      }
    }
  }

  onMouse (mouseData) {
    var self = this
    process.nextTick(() => { self._lastMouseData = mouseData })
    if (mouseData.action === 'wheeldown' || mouseData.action === 'wheelup') {
      self.scroll.row += {
        wheelup: -1,
        wheeldown: 1
      }[mouseData.action] * self.props.pageLines
      self.clipScroll()
      return
    }

    var mouse = self.realPos(new Point(mouseData.y, mouseData.x)
      .translate(BaseWidget.prototype.pos.call(self.refs.buffer).negate())
      .translate(self.scroll))

    var newSelection = self.selection.copy()
    if (mouseData.action === 'mouseup') self.lastClick = {mouse: mouse, time: Date.now()}
    if (mouseData.action === 'mousedown') {
      var lastClick = self.lastClick
      if (lastClick && mouse.isEqual(lastClick.mouse) && lastClick.time + self.props.doubleClickDuration > Date.now()) {
        self.lastClick = null
        var line = self.textBuf.lineForRow(mouse.row)
        var startX = mouse.column
        var endX = mouse.column + 1
        var prev = word.prev(line, mouse.column)
        var current = word.current(line, mouse.column)
        if (current) {
          if (prev && current.index < prev.index + prev[0].length) {
            startX = prev.index
            endX = prev.index + prev[0].length
          } else if (current.index <= mouse.column && mouse.column < current.index + current[0].length) {
            startX = current.index
            endX = current.index + current[0].length
          }
        }
        newSelection.setRange(new Range(new Point(mouse.row, startX), new Point(mouse.row, endX)))
      } else {
        if ((self._lastMouseData || {}).action !== 'mousedown' && !mouseData.shift) newSelection.clearTail()
        newSelection.setHeadPosition(mouse)
        newSelection.plantTail()
      }
    }
    self.selection.setRange(newSelection.getRange(), {reversed: newSelection.isReversed()})
    newSelection.destroy()
  }

  onDetach () {
    this.textBuf.destroy()
    this._updateCursor()

    if (--Editor.count) return
    Editor.highlightClient
      .tap(client => {
        if (!client) return
        client.dontRespawn = true
        client.kill()
      })
      .done()
  }

  clipScroll (poss) {
    var self = this

    var size = BaseWidget.prototype.size.call(self.refs.buffer)
    var scroll = (poss || []).reduce((scroll, pos) => {
      var cursorPadding = self.props.buffer.cursorPadding || {}
      var minScroll = pos.translate(size.negate())
        .translate(new Point((cursorPadding.right || 0) + 1, (cursorPadding.bottom || 0) + 1))
      var maxScroll = pos
        .translate(new Point(-cursorPadding.left || 0, -cursorPadding.top || 0))

      return new Point(
        Math.min(Math.max(scroll.row,    minScroll.row),    maxScroll.row),
        Math.min(Math.max(scroll.column, minScroll.column), maxScroll.column))
    }, self.scroll)

    self.scroll = new Point(
      Math.max(0, Math.min(scroll.row, self.textBuf.getLineCount() - size.row)),
      Math.max(0, scroll.column))
    self.forceUpdate()

    return self
  }
  _markMatches () {
    var self = this
    var selection = self.selection.getRange()
    var selectionText = self.textBuf.getTextInRange(selection)
    var line = self.lineWithEndingForRow(selection.end.row)

    self.destroyMarkers({type: 'match'})
    if (selection.isSingleLine() && selectionText.match(/^[\w.-]+$/)
     && (line[selection.start.column - 1] || ' ').match(/\W/)
     && (line[selection.end.column] || ' ').match(/\W/)) {
      self.textBuf.scan(new RegExp(`\\b${_.escapeRegExp(selectionText)}\\b`, 'g'), match => {
        self.textBuf.markRange(match.range, {type: 'match'})
      })
    }
    return self
  }

  destroyMarkers (params) {
    _.invoke(this.textBuf.findMarkers(params), 'destroy')
    return this
  }

  static markerCmp (a, b) {
    return Editor.MARKER_ORDER.indexOf(b.properties.type) - Editor.MARKER_ORDER.indexOf(a.properties.type)
  }

  _updateCursor () {
    var self = this
    var screen = self.screen
    if (!screen) return
    var program = screen.program
    var buffer = self.refs.buffer
    if (!buffer.visible) {
      program.hideCursor()
      return
    }
    var scrollCursor = self.visiblePos(self.selection.getHeadPosition()).translate(self.scroll.negate())
    if (BaseWidget.prototype.hasFocus.call(self.refs.root) && new Range(
      new Point(0, 0),
      BaseWidget.prototype.size.call(buffer).translate(new Point(-1, -1))
    ).containsPoint(scrollCursor)) {
      var screenCursor = scrollCursor.translate(BaseWidget.prototype.pos.call(buffer))
      program.move(screenCursor.column, screenCursor.row)
      program.showCursor()
    } else {
      program.hideCursor()
    }
  }

  _renderableTabString (match) {
    return !this.props.buffer.visibleWhiteSpace
      ? _.repeat(' ', this.props.buffer.tabSize * match.length)
      : util.markup(_.repeat(
          _.repeat('\u2500', this.props.buffer.tabSize - 1) +
          (this.props.buffer.tabSize ? '\u2574' : '')
        , match.length), this.props.style.whiteSpace)
  }
  _renderableSpace (match) {
    return !this.props.buffer.visibleWhiteSpace
      ? match
      : util.markup(_.repeat('\u00b7', match.length), this.props.style.whiteSpace)
  }
  _renderableLineEnding (lineEnding) {
    return !this.props.buffer.visibleLineEndings
      ? ''
      : util.markup(lineEnding
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
       , this.props.style.whiteSpace)
  }

  render () {
    var self = this
    var props = self.props

    var size = self.refs.buffer
      ? BaseWidget.prototype.size.call(self.refs.buffer)
      : new Point(1024, 1024)
    var scroll = self.scroll
    var selection = self.selection
    var selectionRange = selection.getRange()
    var matchingBracket = self.matchingBracket(selection.getHeadPosition())
    var cursorOnBracket = selectionRange.isEmpty() && matchingBracket !== undefined
    var visibleSelection = self.visiblePos(selectionRange)
    var visibleCursor = visibleSelection[selection.reversed ? 'start' : 'end']
    var visibleMatchingBracket = selectionRange.isEmpty() && matchingBracket && self.visiblePos(matchingBracket)

    var style = props.style
    var defaultStyle = style.default
    var selectionStyle = style.selection
    var matchStyle = style.match
    var bracketStyle = matchingBracket && matchingBracket.match ? style.matchingBracket : style.mismatchedBracket

    var gutterWidth = props.gutter.width
    var lineNumberWidth = props.gutter.lineNumberWidth || 0
    var currentLineStyle = props.gutter.style.currentLine

    var lines = util.text.splitLines(BaseWidget.blessed.escape(self.textBuf.getTextInRange({
      start: new Point(scroll.row, 0),
      end: scroll.translate(size)
    })))
    return (
      <element ref="root"
        onKeypress={self.onKeypress.bind(self)} keyable={true}
        onMouse={self.onMouse.bind(self)} clickable={true}
        onDetach={self.onDetach.bind(self)}>

        <box ref="gutter" {...props.gutter}
          width={gutterWidth}
          wrap={false}
          tags={true}>
          {lines.map((line, row) => {
            var column = scroll.column
            row += scroll.row
            var gutterLine = _.padLeft(row + 1, lineNumberWidth) + _.repeat(' ', gutterWidth)
            if (currentLineStyle && row === visibleCursor.row) {
              gutterLine = util.markup(gutterLine, currentLineStyle)
            }
            return gutterLine + '{/}'
          }).join('\n')}
        </box>

        <box ref="buffer" {...props.buffer}
          left={gutterWidth}
          wrap={false}
          tags={true}>
          {lines.map((line, row) => {
            var column = scroll.column
            row += scroll.row
            var renderableLineEnding = self._renderableLineEnding((line.match(util.text._lineRegExp) || [''])[0])
            line = line
              .replace(/\t+/g, self._renderableTabString.bind(self))
              .replace(/ +/g, self._renderableSpace.bind(self))
              .replace(util.text._lineRegExp, renderableLineEnding)
              .replace(Editor._nonprintableRegExp, '\ufffd')
            line = util.markup.parse(line)
              .slice(column, column + size.column)
              .push(_.repeat(' ', size.column))
              .tag(defaultStyle)
            self.textBuf.findMarkers({intersectsRow: row}).sort(Editor.markerCmp).forEach(marker => {
              var range = self.visiblePos(marker.getRange())
              if (range.intersectsRow(row)) {
                var markerStyle
                switch (marker.properties.type) {
                  case 'selection': markerStyle = selectionStyle; break
                  case 'match': case 'findMatch': markerStyle = matchStyle; break
                  case 'syntax': markerStyle = marker.properties.syntax
                    .map(syntax => {
                      if (!(syntax in style)) util.logger.debug("unstyled syntax:", syntax)
                      return style[syntax] || ''
                    })
                    .join(''); break
                  default: throw new Error("unknown marker: " + marker.properties.type)
                }
                line = util.markup(line, markerStyle,
                  row === range.start.row ? range.start.column - column : 0,
                  row === range.end.row   ? range.end.column   - column : Infinity)
              }
            })
            if (cursorOnBracket && row === visibleCursor.row) {
              line = util.markup(line, bracketStyle,
                visibleCursor.column - column,
                visibleCursor.column - column + 1)
            }
            if (visibleMatchingBracket && row === visibleMatchingBracket.row) {
              line = util.markup(line, bracketStyle,
                visibleMatchingBracket.column - column,
                visibleMatchingBracket.column - column + 1)
            }
            return line + '{/}'
          }).join('\n')}
        </box>

      </element>
    )
  }
}

_.merge(Editor, {
  count: 0,
  MARKER_ORDER: ['syntax', 'match', 'findMatch', 'selection'],
  // looks for path like /home/dan/file.c:3:8 but matches every string
  openRegExp: new RegExp(['^',
    '(.*?)',          // path:   match[1] (like /home/dan/file.c)
    '(?:\\:(\\d+))?', // row:    match[2] (like 3, optional)
    '(?:\\:(\\d+))?', // column: match[3] (like 8, optional)
    '$'].join('')),
  _tabRegExp: /\t/g,
  _bracketsRegExp: /((\()|(\[)|(\{))|((\))|(\])|(\}))/,
  _nonprintableRegExp: /[\x00-\x1f]|\x7f/g
})
