#!/usr/bin/env babel-node
'use strict';

var _path = require('path');

var _fs = require('fs');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBlessed = require('react-blessed');

var _blessed = require('blessed');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxCliLogger = require('@marionebl/redux-cli-logger');

var _reduxCliLogger2 = _interopRequireDefault(_reduxCliLogger);

var _ = require('..');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderEditor(screen, store) {
	var Application = (0, _.createEditorConnector)()(_.Editor);

	return (0, _reactBlessed.render)(_react2.default.createElement(
		_reactRedux.Provider,
		{ store: store },
		_react2.default.createElement(Application, null)
	), screen);
}

function getStore(reducers, contents, screen) {
	var initial = {
		contents: contents,
		focus: true,
		gutter: true,
		cursor: {
			x: 0,
			y: 0
		}
	};

	var middlwares = (0, _redux.applyMiddleware)((0, _reduxCliLogger2.default)({
		console: {
			log: screen.log.bind(screen)
		}
	}));

	var store = (0, _redux.createStore)(reducers, initial);
	return store;
}

function getScreen() {
	var screen = new _blessed.Screen({
		handleUncaughtExceptions: false,
		log: 'debug.log'
	});

	screen.key(['C-q', 'C-c'], function () {
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
	var source = (0, _path.resolve)(__filename);
	var contents = (0, _fs.readFileSync)(source, 'utf-8');

	var editorReducers = (0, _.createEditorReducers)();
	var combined = (0, _redux.combineReducers)(editorReducers);
	var screen = getScreen();

	var store = getStore(combined, contents, screen);
	renderEditor(screen, store);

	if (module.hotswap) {
		module.hotswap.on('hotswap', function () {
			var next = (0, _redux.combineReducers)(editorReducers);
			screen = refreshScreen(screen);
			store.replaceReducer(next);
			renderEditor(screen, store);
		});

		module.hotswap.on('error', function (error) {
			console.error(error.message);
			console.error(error.stack);
		});
	}
}

main();