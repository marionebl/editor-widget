import React, {Component} from 'react'
import {times, merge} from 'lodash/fp';
import pure from 'pure-render-decorator';

import GutterLine from './GutterLine';
import {plus} from './utilities/plus';

@pure
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
          getRange(lines).map((line, y) => {
            return (
              <GutterLine
                width={width}
                style={style}
                activeStyle={activeStyle}
                top={y}
                active={y === active - offset}
                currentLine={style.currentLine}
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
