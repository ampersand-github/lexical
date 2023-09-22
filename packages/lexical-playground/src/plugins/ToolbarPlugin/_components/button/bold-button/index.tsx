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
  isBold: boolean;
};

export const BoldButton = ({
  disabled,
  activeEditor,
  isApple,
  isBold,
}: Props) => {
  const _arialLabel = `Format text as bold. Shortcut: ${
    isApple ? '⌘B' : 'Ctrl+B'
  }`;

  return (
    <button
      disabled={disabled}
      onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
      title={isApple ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
      type="button"
      aria-label={_arialLabel}>
      <i className="format bold" />
    </button>
  );
};
