import React, {Component, PropTypes as t} from 'react';
import deep from './utilities/deep-defaults';
import autobind from 'autobind-decorator';

function updateCursor(program, top, left) {
	program.showCursor();
	program.cursorPos(top, left);
}

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
		if (ref) {
			const {screen} = ref;
			const {program} = screen;
			this.node = ref;
			this.screen = screen;
			this.program = program;
		}
	}

	handlePosition() {
		const {program, node} = this;
		const {top, left} = this.props;
		const offsetTop = node ? node.atop : 0;
		const offsetLeft = node ? node.aleft : 0;
		if (program) {
			updateCursor(program, top + offsetTop, left + offsetLeft);
		}
	}

	/**
	 * Component lifecycle hooks
	 */
	componentDidMount() {
		this.handlePosition();
	}

	componentDidUpdate() {
		this.handlePosition();
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
