import {Component} from 'react';
import {merge} from 'lodash/fp';

/**
 * @param object component React component
 */
export function deepDefaultsDecorator(ComponentDefinition) {
	const ComponentDefinitionPrototype = Object.getPrototypeOf(ComponentDefinition);

	if (ComponentDefinitionPrototype !== Component) {
		const name = ComponentDefinition.super.name;
		throw new Error(`react-deep-defaults only works on react component defintions, called on ${name}`);
	}

	if (!ComponentDefinition.defaultProps) {
		return ComponentDefinition;
	}

	const mergeDefaultProps = merge(ComponentDefinition.defaultProps);

	const {
		componentWillReceiveProps,
		shouldComponentUpdate,
		componentWillUpdate,
		render
	} = ComponentDefinition.prototype;

	const descriptors = {};

	if (componentWillReceiveProps) {
		descriptors.componentWillReceiveProps = {
			value(nextProps) {
				const merged = mergeDefaultProps(nextProps);
				return this::componentWillReceiveProps(merged);
			}
		};
	}

	if (shouldComponentUpdate) {
		descriptors.shouldComponentUpdate = {
			value(nextProps, nextState) {
				const merged = mergeDefaultProps(nextProps);
				return this::shouldComponentUpdate(merged, nextState);
			}
		};
	}

	if (componentWillUpdate) {
		descriptors.componentWillUpdate = {
			value(nextProps, nextState) {
				const merged = mergeDefaultProps(nextProps);
				return this::componentWillUpdate(merged, nextState);
			}
		};
	}

	if (render) {
		descriptors.render = {
			value() {
				const merged = mergeDefaultProps(this.props);
				return this::render(merged, this.state);
			}
		};
	}

	Object.defineProperties(ComponentDefinition.prototype, descriptors);
	return ComponentDefinition;
}

export default deepDefaultsDecorator;
