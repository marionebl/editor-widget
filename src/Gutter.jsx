import React, {Component} from 'react'
import {times, merge} from 'lodash/fp';

import GutterLine from './GutterLine';
import {plus} from './utilities/plus';

class Gutter extends Component {
  static defaultProps = {
    style: {},
    width: 6
  };

  render() {
    const props = merge(Gutter.defaultProps)(this.props);

    const {
      lines,
      width,
      style,
      activeStyle,
      active,
      offset,
      ...other
    } = props

    const account = plus(offset);
    const getRange = times(account);

    return (
      <box {...other} wrap={false}>
        {
          getRange(lines).map((line, offset) => {
            return (
              <GutterLine
                width={width}
                style={style}
                activeStyle={activeStyle}
                top={offset}
                active={offset === active}
                currentLine={style.currentLine}
                key={`GutterLine-${line}`}
                >
                {line}
              </GutterLine>
            );
          })
        }
      </box>
    );
  }
}

export default Gutter;
