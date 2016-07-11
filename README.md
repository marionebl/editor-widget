> Project status: 🚧💥

# react-blessed-editor

A multiline editor for [react-blessed](https://github.com/Yomguithereal/react-blessed). Inspired [slap-editor](https://github.com/slap-editor/slap)'s excellect [editor-widget](https://github.com/slap-editor/editor-widget) .

*  Radically component oriented design
*  Fully customizable
*  Plug and play(ish) via default reducers and connectors

## Installation

Grab it via `npm`

```sh
npm install --save react-blessed-editor
```

## Features

*  User-friendly multiline editing
*  Slap-like key bindings for navigation and editing

## Usage

react-blessed-editor is designed to work with react-blessed. At its core it only provides
stateless components – logic is implemented in cherry-pickable reducers, actions and connectors.

**Using default reducers and connector**

```js
import React from 'react';
import {render} from 'react-blessed';
import {Screen} from 'blessed';

import {createStore, combineReducers} from 'redux';
import {Editor, createEditorReducers, createEditorConnectors} from 'react-blessed-editor';

const editorReducers = createEditorReducers('default'); // create reducers namespaced to `.default`
const editorReducer = combineReducers(editorReducers);

const editorStore = createStore(editorReducer, {
	default: {
		contents: 'This will be the initial content\n\nIt is namespaced to .default'
	}
});
const ConnectedEditor = createEditorConnectors('default')(Editor);
const Application = <Provider store={editorStore}><ConnectedEditor/></Provider>;

render(Application, screen);
```

## Roadmap
*  [ ] :warning: Scrolling
*  [ ] :warning: Proper tabs support
*  [ ] ⚡Performance ⚡Performance ⚡Performance
*  [ ] Invisible character representation
*  [ ] Extended copy and paste support
*  [ ] Syntax highlighting
*  [ ] More usage examples

---
Built by Mario Nebl. Released under the [MIT License](./LICENSE)
