/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {$patchStyleText} from '@lexical/selection';
import {
  $getSelection,
  $isRangeSelection,
  DEPRECATED_$isGridSelection,
  LexicalEditor,
} from 'lexical';
import * as React from 'react';
import {useCallback} from 'react';

import DropdownColorPicker from '../../../../../ui/DropdownColorPicker';

type Props = {
  disabled: boolean;
  color: string;
  activeEditor: LexicalEditor;
};

export const TextColorPickerButton = ({
  disabled,
  color,
  activeEditor,
}: Props) => {
  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor],
  );
  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({color: value});
    },
    [applyStyleText],
  );

  return (
    <DropdownColorPicker
      disabled={disabled}
      buttonClassName="toolbar-item color-picker"
      buttonAriaLabel="Formatting text color"
      buttonIconClassName="icon font-color"
      color={color}
      onChange={onFontColorSelect}
      title="text color"
    />
  );
};
