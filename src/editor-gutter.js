import React, {Component, PropTypes as t} from 'react';
import {times} from 'lodash/fp';

import pure from 'pure-render-decorator';

import EditorGutterLine from './editor-gutter-line';
import {plus} from './utilities/plus';
import deep from './utilities/deep-defaults';

@pure
@deep
class EditorGutter extends Component {
	static propTypes = {
		lines: t.number.isRequired,
		width: t.number.isRequired,
		active: t.number.isRequired,
		offset: t.number,
		style: t.shape({
			bg: t.string,
			fg: t.string
		}),
		activeStyle: t.shape({
			bg: t.string,
			fg: t.string
		})
	};

	static defaultProps = {
		style: {},
		activeStyle: {},
		lines: 0,
		active: -1,
		offset: 0,
		width: 6
	};

	render(props) {
		const {
			lines,
			width,
			style,
			activeStyle,
			active,
			offset,
			...other
		} = props;

		const account = plus(offset);
		const getRange = times(account);

		return (
			<box {...other} wrap={false}>
				{
					getRange(lines).map((line, y) => {
						return (
							<EditorGutterLine
								width={width}
								style={style}
								activeStyle={activeStyle}
								top={y}
								key={y}
								active={y === active - offset}
								currentLine={style.currentLine}
								>
								{String(line)}
							</EditorGutterLine>
						);
					})
				}
			</box>
		);
	}
}

export {EditorGutter};
export default EditorGutter;