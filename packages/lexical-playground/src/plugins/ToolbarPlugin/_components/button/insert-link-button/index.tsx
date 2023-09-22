/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {TOGGLE_LINK_COMMAND} from '@lexical/link';
import {LexicalEditor} from 'lexical';
import * as React from 'react';
import {useCallback} from 'react';

import {sanitizeUrl} from '../../../../../utils/url';

type Props = {
  disabled: boolean;
  isInsertLink: boolean;
  activeEditor: LexicalEditor;
};

export const InsertLinkButton = ({
  disabled,
  isInsertLink,
  activeEditor,
}: Props) => {
  const insertLink = useCallback(() => {
    if (!isInsertLink) {
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl('https://'),
      );
    } else {
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isInsertLink]);

  return (
    <button
      disabled={disabled}
      onClick={insertLink}
      className={'toolbar-item spaced ' + (isInsertLink ? 'active' : '')}
      title="Insert link"
      type="button"
      aria-label={'Insert link'}>
      <i className="format link" />
    </button>
  );
};
