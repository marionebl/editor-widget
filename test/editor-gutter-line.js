import test from 'ava';
import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import unexpected from 'unexpected';
import unexpectedReact from 'unexpected-react';

import {EditorGutterLine} from '../src';

const expect = unexpected.clone().use(unexpectedReact);
const renderer = createRenderer();

test('when rendering with required props', () => {
	renderer.render(<EditorGutterLine>1</EditorGutterLine>);
	expect(renderer, 'to have rendered with all children', <box>1</box>);
});

test('when rendering with style prop', () => {
	const defaultStyles = EditorGutterLine.defaultProps.style;
	renderer.render(<EditorGutterLine style={{}}>1</EditorGutterLine>);
	expect(renderer, 'to have rendered', <box style={defaultStyles}/>);
});

test('when rendering with active flag', () => {
	const {activeStyle} = EditorGutterLine.defaultProps;
	renderer.render(<EditorGutterLine active>1</EditorGutterLine>);
	expect(renderer, 'to have rendered', <box style={activeStyle}/>);
});

test('when rendering with active styles and flag', () => {
	const props = {activeStyle: {fg: 'red', bg: 'green'}, active: true};
	renderer.render(<EditorGutterLine {...props}>1</EditorGutterLine>);
	expect(renderer, 'to have rendered', <box style={props.activeStyle}/>);
});
