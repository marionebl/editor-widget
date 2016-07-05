import React, {Component, PropTypes as t} from 'react'
import autobind from 'autobind-decorator';
import pure from 'pure-render-decorator';

import {merge} from 'lodash/fp';
import {parseTags} from 'blessed';
import {markup} from 'slap-util'

@pure
class BufferLine extends Component {
  static propTypes = {
    row: t.number.isRequired,
    markers: t.array.isRequired,
    children: t.string.isRequired
  };

  render() {
    const {
      children,
      column,
      maxWidth,
      row,
      markers,
      ...props
    } = this.props;

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

@pure
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
          lines.map((line, y) => {
            const intersectsRow = y + offsetY;
            const markers = textBuffer.findMarkers({intersectsRow});

            return (
              <BufferLine
                top={y}
                row={intersectsRow}
                column={offsetX}
                maxWidth={size.column}
                markers={markers}
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
