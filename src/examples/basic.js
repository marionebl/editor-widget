#!/usr/bin/env babel-node
import {resolve} from 'path';
import {readFileSync} from 'fs';

import React from 'react';
import {render} from 'react-blessed';
import {Screen} from 'blessed';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import createLogger from '@marionebl/redux-cli-logger';

import {Editor, editorReducers, connect} from '..';

function renderEditor(screen, store) {
	const Application = connect(Editor);

	return render(
		<Provider store={store}>
			<Application/>
		</Provider>,
		screen
	);
}

function getStore(reducers, contents, screen) {
	const initial = {
		contents,
		gutter: true,
		focus: true,
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

	const store = createStore(reducers, initial, middlwares);
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
	return getScreen();
}

function main() {
	const source = resolve(__dirname, 'foo');
	const contents = readFileSync(source, 'utf-8');

	const combined = combineReducers(editorReducers);
	let screen = getScreen();

	const store = getStore(combined, contents, screen);
	renderEditor(screen, store);

	if (module.hotswap) {
		module.hotswap.on('hotswap', () => {
			const next = combineReducers(reducers);
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
