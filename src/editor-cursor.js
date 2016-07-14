import React, {Component, PropTypes as t} from 'react';
import pure from 'pure-render-decorator';
import deep from './utilities/deep-defaults';
import autobind from 'autobind-decorator';

@pure
@deep
@autobind
class EditorCursor extends Component {
	static propTypes = {
		top: t.number.isRequired,
		left: t.number.isRequired,
		style: t.any
	};

	static defaultProps = {
		style: {
			fg: 'black',
			bg: 'white'
		}
	};

	/**
	 * Instance properties
	 */
	node = null;
	screen = null;
	program = null;

	/**
	 * Helper methods
	 */
	saveNode(ref) {
		const {screen} = ref;
		const {program} = screen;
		this.node = ref;
		this.screen = screen;
		this.program = program;
	}

	/**
	 * Component lifecycle hooks
	 */
	componentDidMount() {
		const {program} = this;
		const {top, left} = this.props;
		if (program) {
			program.showCursor();
			program.cursorPos(top, left);
		}
	}

	componentDidUpdate() {
		const {program} = this;
		const {top, left} = this.props;
		if (program) {
			program.showCursor();
			program.cursorPos(top, left);
		}
	}

	render() {
		return (
			<box
				ref={this.saveNode}
				width={0}
				height={0}
				/>
		);
	}
}

export {EditorCursor};
export default EditorCursor;
