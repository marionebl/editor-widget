import React, {Component, PropTypes as t} from 'react';
import {highlightAuto} from 'emphasize';
import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';

import deep from './utilities/deep-defaults';
import EditorBufferLine from './editor-buffer-line';

@pure
@deep
export class EditorBuffer extends Component {
	static defaultProps = {
		lines: []
	};

	static propTypes = {
		children: t.string,
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

	render(props) {
		const {
			children,
			offsetX,
			offsetY
		} = props;

		const {value: content} = highlightAuto(children);
		const lines = children.split('\n');

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
