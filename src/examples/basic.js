#!/usr/bin/env babel-node
import {readFileSync} from 'fs';

import React from 'react';
import {render} from 'react-blessed';
import {Screen} from 'blessed';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {Editor, reducers, connectors} from '..';

function renderEditor(screen, store) {
	const {editor: connect} = connectors;
	const Application = connect(Editor);

	return render(
		<Provider store={store}>
			<Application/>
		</Provider>,
		screen
	);
}

function main() {
	const contents = readFileSync(__filename, 'utf-8');

	const combined = combineReducers(reducers);

	const store = createStore(combined, {
		contents,
		gutter: true,
		focus: true,
		cursor: {
			x: 4,
			y: 3
		}
	});

	const screen = new Screen({
		handleUncaughtExceptions: false,
		log: 'debug.log'
	});

	screen.key(['C-q', 'C-c'], () => {
		screen.destroy();
		process.exit(0);
	});

	renderEditor(screen, store);

	if (module.hotswap) {
		module.hotswap.on('hotswap', () => {
			const next = combineReducers(reducers);
			store.replaceReducer(next);
			// renderEditor(screen, store);
		});

		module.hotswap.on('error', error => {
			console.error(error.message);
			console.error(error.stack);
		});
	}
}

main();
