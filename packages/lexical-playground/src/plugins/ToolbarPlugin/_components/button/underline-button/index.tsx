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
  isUnderline: boolean;
};

export const UnderlineButton = ({
  disabled,
  activeEditor,
  isApple,
  isUnderline,
}: Props) => {
  const _arialLabel = `Format text as underlined. Shortcut: ${
    isApple ? '⌘U' : 'Ctrl+U'
  }`;

  return (
    <button
      disabled={disabled}
      onClick={() =>
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
      }
      className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
      title={isApple ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
      type="button"
      aria-label={_arialLabel}>
      <i className="format underline" />
    </button>
  );
};
