import React, {Component, PropTypes as t} from 'react';
import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';

import EditorBuffer from './editor-buffer';
import EditorGutter from './editor-gutter';

@pure
@autobind
export class Editor extends Component {
	static propTypes = {
		children: t.string,
		cursor: t.shape({
			x: t.number.isRequired,
			y: t.number.isRequired
		}),
		gutter: t.oneOfType([
			t.bool,
			t.shape(EditorGutter.propTypes)
		])
	};

	static defaultProps = {
		children: '',
		cursor: {
			x: 0,
			y: 0
		},
		gutter: false
	};

	render() {
		const {
			gutter
		} = this.props;

		return (
			<box>
				{
					gutter &&
						<EditorGutter/>
				}
				{
					<EditorBuffer/>
				}
			</box>
		);
	}
}

export default Editor;
