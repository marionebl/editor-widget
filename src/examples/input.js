#!/usr/bin/env babel-node
import {resolve} from 'path';
import {readFileSync} from 'fs';

import React from 'react';
import {render} from 'react-blessed';
import {Screen} from 'blessed';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import createLogger from '@marionebl/redux-cli-logger';

import {Editor, createEditorReducers, createEditorConnector} from '..';

function renderEditor(screen, store) {
	const Application = createEditorConnector()(Editor);

	return render(
		<Provider store={store}>
			<Application multiline={false}/>
		</Provider>,
		screen
	);
}

function getStore(reducers, contents, screen) {
	const initial = {
		contents,
		focus: true,
		gutter: true,
		cursor: {
			x: 0,
			y: 0
		}
	};

	const middlwares = applyMiddleware(
		createLogger({
			console: {
				log: ::screen.log
			}
		})
	);

	const store = createStore(reducers, initial, /* middlwares */);
	return store;
}

function getScreen() {
	const screen = new Screen({
		handleUncaughtExceptions: false,
		log: 'debug.log'
	});

	screen.key(['C-q', 'C-c'], () => {
		screen.destroy();
		process.exit(0);
	});

	global.screen = screen;
	return screen;
}

function refreshScreen(screen) {
	screen.destroy();
	screen.removeAllListeners();
	return getScreen();
}

function main() {
	const editorReducers = createEditorReducers();
	const combined = combineReducers(editorReducers);
	let screen = getScreen();

	const store = getStore(combined, '', screen);
	renderEditor(screen, store);

	if (module.hotswap) {
		module.hotswap.on('hotswap', () => {
			const next = combineReducers(editorReducers);
			screen = refreshScreen(screen);
			store.replaceReducer(next);
			renderEditor(screen, store);
		});

		module.hotswap.on('error', error => {
			console.error(error.message);
			console.error(error.stack);
		});
	}
}

main();
