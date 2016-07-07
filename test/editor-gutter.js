import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import {createRenderer} from 'react-addons-test-utils';
import unexpected from 'unexpected';
import unexpectedReact from 'unexpected-react';

import {EditorGutter} from '../src';

const expect = unexpected.clone().use(unexpectedReact);
const renderer = createRenderer();

test('when rendering without props', () => {
	renderer.render(<EditorGutter/>);
	expect(renderer, 'to have rendered with all children', <box/>);
});

test('when rendering with lines', () => {
	const wrapper = shallow(<EditorGutter lines={5}/>);
	const lines = wrapper.find('EditorGutterLine');
	const active = wrapper.contains('EditorGutterLine[active]');

	expect(lines.length, 'to be', 5);
	expect(active, 'to be falsy');
});

test('when rendering with active line', () => {
	const wrapper = shallow(<EditorGutter active={0} lines={1}/>);
	const active = wrapper.find('EditorGutterLine[active=true]');

	expect(active.length, 'to be', 1);
});

test('when rendering with other props', t => {
	if ('top' in EditorGutter.propTypes || 'top' in EditorGutter.defaultProps) {
		t.fail('top is no longer a non-handled prop of EditorGutter');
	}

	renderer.render(<EditorGutter top={0}/>);
	expect(renderer, 'to have rendered', <box top={0}/>);
});
