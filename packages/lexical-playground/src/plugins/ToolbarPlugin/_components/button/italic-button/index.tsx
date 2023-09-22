/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {FORMAT_TEXT_COMMAND, LexicalEditor} from 'lexical';
import * as React from 'react';

type Props = {
  disabled: boolean;
  activeEditor: LexicalEditor;
  isApple: boolean;
  isItalic: boolean;
};

export const ItalicButton = ({
  disabled,
  activeEditor,
  isApple,
  isItalic,
}: Props) => {
  const _arialLabel = `Format text as italics. Shortcut: ${
    isApple ? '⌘I' : 'Ctrl+I'
  }`;

  return (
    <button
      disabled={disabled}
      onClick={() =>
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
      }
      className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
      title={isApple ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
      type="button"
      aria-label={_arialLabel}>
      <i className="format italic" />
    </button>
  );
};
