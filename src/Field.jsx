import React from 'react'
import _ from 'lodash'

import Editor from './Editor'
import editorWidgetOpts from './opts'

export default class Field extends Editor {
  static get defaultProps () {
    return _.merge({}, Editor.defaultProps, {
      height: 1,
      multiLine: false
    }, editorWidgetOpts.field)
  }
  submit (value) { this.emit('submit', value) }
  cancel () { this.emit('cancel') }
  onKeypress (ch, key) {
    var self = this
    switch (self.resolveBinding(key)) {
      case 'submit': self.submit(self.textBuf.getText()); return false
      case 'cancel': self.cancel(); return false
    }
    return super.onKeypress(ch, key)
  }
}
