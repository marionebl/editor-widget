import React, {Component, PropTypes as t} from 'react';
import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';
import deep from './utilities/deep-defaults';

import {merge} from 'lodash/fp';

import EditorBufferLine from './editor-buffer-line';

@pure
@deep
export class EditorBuffer extends Component {
	static defaultProps = {
		lines: []
	};

	static propTypes = {
		textBuffer: t.any.isRequired,
		lines: t.arrayOf(t.string).isRequired
	};

	references = {};

  @autobind
	reference(name) {
		return reference => {
			if (reference instanceof Component) {
				this.references[name] = reference.root;
			} else {
				this.references[name] = reference;
			}
		};
	}

	render() {
		const props = merge(EditorBuffer.defaultProps)(this.props);
		const {
			lines,
			offsetX,
			offsetY,
			size
		} = props;

		return (
			<box
				{...props}
				ref={this.reference('root')}
				wrap={false}
				tags={false}
				>
				{
					lines.map((line, y) => {
						const intersectsRow = y + offsetY;

						return (
							<EditorBufferLine
								top={y}
								key={y}
								row={intersectsRow}
								column={offsetX}
								maxWidth={size.column}
								>
								{line}
							</EditorBufferLine>
						);
					})
				}
			</box>
		);
	}
}

export default EditorBuffer;
