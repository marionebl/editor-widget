import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import {createRenderer} from 'react-addons-test-utils';
import unexpected from 'unexpected';
import unexpectedReact from 'unexpected-react';

import {Editor, EditorBuffer} from '../src';

const expect = unexpected.clone().use(unexpectedReact);
const renderer = createRenderer();

test('when rendering without props', () => {
	renderer.render(<Editor/>);
	expect(renderer, 'to have rendered with all children', <box><EditorBuffer/></box>);
});
