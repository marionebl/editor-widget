import React, {Component, PropTypes as t} from 'react';

import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';
import deep from './utilities/deep-defaults';

@pure
@deep
@autobind
class EditorGutterLine extends Component {
	static defaultProps = {
		align: 'right',
		children: '',
		style: {
			fg: 'grey'
		},
		activeStyle: {
			fg: 'white',
			bold: true
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
