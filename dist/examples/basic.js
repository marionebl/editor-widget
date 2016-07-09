#!/usr/bin/env babel-node
'use strict';

var _fs = require('fs');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBlessed = require('react-blessed');

var _blessed = require('blessed');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _ = require('..');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderEditor(screen, store) {
	var connect = _.connectors.editor;

	var Application = connect(_.Editor);

	return (0, _reactBlessed.render)(_react2.default.createElement(
		_reactRedux.Provider,
		{ store: store },
		_react2.default.createElement(Application, null)
	), screen);
}

function main() {
	var contents = (0, _fs.readFileSync)(__filename, 'utf-8');

	var combined = (0, _redux.combineReducers)(_.reducers);

	var store = (0, _redux.createStore)(combined, {
		contents: contents,
		gutter: true,
		focus: true,
		cursor: {
			x: 4,
			y: 11
		}
	});

	var screen = new _blessed.Screen({
		handleUncaughtExceptions: false,
		log: 'debug.log'
	});
	global.screen = screen;

	screen.key(['C-q', 'C-c'], function () {
		screen.destroy();
		process.exit(0);
	});

	renderEditor(screen, store);

	if (module.hotswap) {
		module.hotswap.on('hotswap', function () {
			var next = (0, _redux.combineReducers)(_.reducers);
			store.replaceReducer(next);
			// renderEditor(screen, store);
		});

		module.hotswap.on('error', function (error) {
			console.error(error.message);
			console.error(error.stack);
		});
	}
}

main();