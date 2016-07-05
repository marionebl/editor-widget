#!/usr/bin/env babel-node
import {inspect} from 'util'

import React, {Component} from 'react'
import autobind from 'autobind-decorator'
import blessed from 'blessed'
import {render} from 'react-blessed'

import {Editor} from '..'

function write(payload) {
  if (global.screen) {
    global.screen.log(payload);
  } else {
    process.stdout.write(payload);
  }
}

console.log = (...args) => {
  write(`[${Date.now()}]`);
  args.map(arg => {
    if (typeof arg === 'object') {
      write(inspect(arg, {colors: true}));
      return;
    }
    write(`${arg} `);
  });
  write(`\n`);
}

@autobind
export default class EditorExample extends Component {
  saveNode(ref) {
    this.node = ref;
  }
  componentDidMount () {
    this.node.open(__filename).done()
  }
  render () {
    return (
      <Editor {...this.props} ref={this.saveNode} />
    )
  }
}

var screen = new blessed.Screen({
  handleUncaughtExceptions: false,
  log: 'debug.log'
});

screen.key(['C-q', 'C-c'], () => {
  screen.destroy();
  process.exit(0);
});

global.screen = screen;

const props = {
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
  render(<EditorExample {...props}/>, screen)
} catch (error) {
  screen.destroy();
  console.error(error);
  throw error;
}
