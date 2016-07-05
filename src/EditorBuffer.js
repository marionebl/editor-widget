import React, {Component, PropTypes as t} from 'react'
import autobind from 'autobind-decorator';
import {merge} from 'lodash/fp';
import {parseTags} from 'blessed';
import {markup} from 'slap-util'

class BufferLine extends Component {
  static propTypes = {
    row: t.number.isRequired,
    textBuffer: t.any.isRequired,
    children: t.string.isRequired
  };

  render() {
    const {
      children,
      column,
      maxWidth,
      row,
      textBuffer,
      ...props
    } = this.props;

    const markers = textBuffer.findMarkers({intersectsRow: row});

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

class EditorBuffer extends Component {
  static defaultProps = {
    lines: []
  };

  static propTypes = {
    textBuffer: t.any.isRequired,
    lines: t.arrayOf(t.string).isRequired
  };

  references = {};

  reference(name) {
    return (reference) => {
      if (reference instanceof Component) {
        this.references[name] = reference.root;
      } else {
        this.references[name] = reference;
      }
    };
  }

  @autobind
  reference(name) {
    return (reference) => {
      if (reference instanceof Component) {
        this.references[name] = reference.root;
      } else {
        this.references[name] = reference;
      }
    };
  }

  render() {
    const props = merge(Buffer.defaultProps)(this.props);
    const {
      lines,
      offsetX,
      offsetY,
      row,
      size,
      textBuffer
    } = props;

    return (
      <box
        {...props}
        ref={this.reference('root')}
        wrap={false}
        tags={false}
        >
        {
          lines.map((line, row) => {
            return (
              <BufferLine
                top={row}
                row={row + offsetY}
                column={offsetX}
                maxWidth={size.column}
                textBuffer={textBuffer}
                >
                {line}
              </BufferLine>
            );
          })
        }
      </box>
    );
  }
}

export default EditorBuffer;
