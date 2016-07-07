import React, {Component, PropTypes as t} from 'react';
import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';

import {parseTags} from 'blessed';

@pure
@autobind
class EditorBufferLine extends Component {
	static propTypes = {
		row: t.number.isRequired,
		markers: t.array.isRequired,
		maxWidth: t.number.isRequired,
		column: t.number.isRequired,
		children: t.string.isRequired
	};

	render() {
		const {
			children,
			column,
			maxWidth,
			...props
		} = this.props;

		const cropped = children
			.slice(column, column + maxWidth);

		const content = parseTags(`${cropped}${' '.repeat(maxWidth)}`);

		return (
			<box {...props}>
				{content}
			</box>
		);
	}
}

export default EditorBufferLine;
