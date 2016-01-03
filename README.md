# editor-widget [![Build Status](https://travis-ci.org/slap-editor/editor-widget.svg?branch=master)](https://travis-ci.org/slap-editor/editor-widget)
`<Editor>` component for [react-blessed](https://github.com/Yomguithereal/react-blessed)

## [src/examples/basic.jsx](src/examples/basic.jsx)
```js
import React, {Component} from 'react'
import blessed from 'blessed'
import {render} from 'react-blessed'

import {Editor} from 'editor-widget'

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
```
