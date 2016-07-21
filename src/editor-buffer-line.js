import React, {Component, PropTypes as t} from 'react';
import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';

// import {parseTags} from 'blessed';

@pure
@autobind
class EditorBufferLine extends Component {
	static propTypes = {
		left: t.number.isRequired,
		offset: t.number.isRequired,
		children: t.string.isRequired
	};

	render() {
		const {
			children,
			left,
			...props
		} = this.props;

		return (
			<box
				{...props}
				>
				{children}
			</box>
		);
	}
}

export default EditorBufferLine;
