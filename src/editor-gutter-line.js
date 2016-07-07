import React, {Component, PropTypes as t} from 'react';

import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';
import deep from './utilities/deep-defaults';

@pure
@deep
@autobind
class EditorGutterLine extends Component {
	static defaultProps = {
		children: '',
		lineNumberWidth: 0,
		style: {
			fg: 'white',
			bg: 'blue'
		},
		activeStyle: {
			fg: 'black',
			bg: 'white'
		}
	};

	static propTypes = {
		children: t.string.isRequired,
		style: t.shape({
			fg: t.string,
			bg: t.string
		}),
		activeStyle: t.shape({
			fg: t.string,
			bg: t.string
		})
	};

	render(props) {
		const {
			active,
			children,
			style: passedStyle,
			activeStyle,
			width,
			...other
		} = props;

		const style = active ?
			activeStyle :
			passedStyle;

		return (
			<box
				{...other}
				style={style}
				width={width}
				>
				{children}
			</box>
		);
	}
}

export {EditorGutterLine};
export default EditorGutterLine;
