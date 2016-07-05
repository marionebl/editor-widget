import React, {Component, PropTypes as t} from 'react'
import {deprecate} from 'react-is-deprecated';
import pure from 'pure-render-decorator';

import util from 'slap-util';
import warning from 'warning';
import {merge, padStart} from 'lodash/fp';

const blank = ' ';

const deprecations = {
  currentLine: `.currentLine styling is deprecated, use .active instead`,
  legacyStylingPrecedes: `GutterLine renders with legacy .currentLine styles instead of .activeLine`
};

function getMarkup(children, styles, minWidth, maxWidth) {
  const fill = blank.repeat(maxWidth);
  const fillStart = padStart(minWidth);
  const content = `${fillStart(String(children))}${fill}`;
  return `${util.markup(content, styles)}{/}`;
}

function getStyle(active, legacy, definition, activeDefinition) {
  if (legacy && active) {
    return {};
  }
  return active ?
    activeDefinition :
    definition;
}

@pure
class GutterLine extends Component {
  static defaultProps = {
    children: '',
    lineNumberWidth: 0,
    style: {
      fg: 'white',
      bg: 'blue',
      activeLine: {
        fg: 'black',
        bg: 'white'
      }
    }
  };

  static propTypes = {
    children: t.string.isRequired,
    style: t.shape({
      fg: t.string,
      bg: t.string,
      activeLine: t.shape({
        fg: t.string,
        bg: t.string
      }),
      currentLine: deprecate(t.string, deprecations.currentLine)
    }),
    lineNumberWidth: t.number
  };

  render() {
    const props = merge(GutterLine.defaultProps)(this.props);

    const {
      active,
      children,
      currentLine,
      lineNumberWidth,
      style: passedStyle,
      activeStyle,
      width,
      ...other
    } = props;

    const usesLegacyStyles = Boolean(currentLine);

    if (usesLegacyStyles) {
      warning(!Boolean(activeStyle), deprecations.legacyStylingPrecedes);
    }

    const content = usesLegacyStyles && active ?
      getMarkup(children, currentLine, lineNumberWidth, width) :
      children;

    const style = getStyle(active, usesLegacyStyles, passedStyle, activeStyle);

    return (
      <box
        {...other}
        style={style}
        tags={usesLegacyStyles}
        width={width}
        >
        {content}
      </box>
    );
  }
}

export default GutterLine;
