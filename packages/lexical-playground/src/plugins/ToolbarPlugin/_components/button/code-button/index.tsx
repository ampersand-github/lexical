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
  isCode: boolean;
  activeEditor: LexicalEditor;
};

export const CodeButton = ({disabled, activeEditor, isCode}: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
      className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
      title="Insert code block"
      type="button"
      aria-label="Insert code block">
      <i className="format code" />
    </button>
  );
};
