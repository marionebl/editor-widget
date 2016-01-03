#!/usr/bin/env babel-node

import React, {Component} from 'react'
import blessed from 'blessed'
import {render} from 'react-blessed'

import {Editor} from '..'

export default class EditorExample extends Component {
  componentDidMount () {
    this.refs.editor.open(__filename).done()
  }
  render () {
    return (
      <Editor ref="editor">
        loading...
      </Editor>
    )
  }
}

var screen = new blessed.Screen()
screen.key('C-q', () => { process.exit() })
render(<EditorExample />, screen)
