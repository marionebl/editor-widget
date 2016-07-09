'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.deepDefaultsDecorator = deepDefaultsDecorator;

var _react = require('react');

var _fp = require('lodash/fp');

/**
 * @param object component React component
 */
function deepDefaultsDecorator(ComponentDefinition) {
	var ComponentDefinitionPrototype = Object.getPrototypeOf(ComponentDefinition);

	if (ComponentDefinitionPrototype !== _react.Component) {
		var name = ComponentDefinition.super.name;
		throw new Error('react-deep-defaults only works on react component defintions, called on ' + name);
	}

	if (!ComponentDefinition.defaultProps) {
		return ComponentDefinition;
	}

	var mergeDefaultProps = (0, _fp.merge)(ComponentDefinition.defaultProps);

	var _ComponentDefinition$ = ComponentDefinition.prototype;
	var componentWillReceiveProps = _ComponentDefinition$.componentWillReceiveProps;
	var shouldComponentUpdate = _ComponentDefinition$.shouldComponentUpdate;
	var componentWillUpdate = _ComponentDefinition$.componentWillUpdate;
	var render = _ComponentDefinition$.render;


	var descriptors = {};

	if (componentWillReceiveProps) {
		descriptors.componentWillReceiveProps = {
			value: function value(nextProps) {
				var merged = mergeDefaultProps(nextProps);
				return componentWillReceiveProps.call(this, merged);
			}
		};
	}

	if (shouldComponentUpdate) {
		descriptors.shouldComponentUpdate = {
			value: function value(nextProps, nextState) {
				var merged = mergeDefaultProps(nextProps);
				return shouldComponentUpdate.call(this, merged, nextState);
			}
		};
	}

	if (componentWillUpdate) {
		descriptors.componentWillUpdate = {
			value: function value(nextProps, nextState) {
				var merged = mergeDefaultProps(nextProps);
				return componentWillUpdate.call(this, merged, nextState);
			}
		};
	}

	if (render) {
		descriptors.render = {
			value: function value() {
				var merged = mergeDefaultProps(this.props);
				return render.call(this, merged, this.state);
			}
		};
	}

	Object.defineProperties(ComponentDefinition.prototype, descriptors);
	return ComponentDefinition;
}

exports.default = deepDefaultsDecorator;