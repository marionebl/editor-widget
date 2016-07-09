'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.resolveBinding = resolveBinding;

var _lodash = require('lodash');

function resolveBinding(name, bindings) {
	if (!name) {
		return;
	}

	var matches = (0, _lodash.entries)(bindings).reduce(function (registry, entry) {
		var _entry = _slicedToArray(entry, 2);

		var binding = _entry[0];
		var names = _entry[1];

		if (names.includes(name)) {
			registry.push(binding);
		}
		return registry;
	}, []);

	return matches[0];
}

exports.default = resolveBinding;