/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {$patchStyleText} from '@lexical/selection';
import {$getSelection, $isRangeSelection, LexicalEditor} from 'lexical';
import {useCallback} from 'react';
import * as React from 'react';

import DropDown, {DropDownItem} from '../../../../../ui/DropDown';

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

const dropDownActiveClass = (active: boolean) =>
  active ? 'active dropdown-item-active' : '';

type FontFamilyProps = {
  editor: LexicalEditor;
  value: string;
  disabled?: boolean;
};

export const FontFamilyDropDownButton = ({
  editor,
  value,
  disabled = false,
}: FontFamilyProps): JSX.Element => {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {'font-family': option});
        }
      });
    },
    [editor],
  );

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item font-family"
      buttonLabel={value}
      buttonIconClassName="icon block-type font-family"
      buttonAriaLabel="Formatting options for font family">
      {FONT_FAMILY_OPTIONS.map(([option, text]) => (
        <DropDownItem
          className={`item ${dropDownActiveClass(value === option)}`}
          onClick={() => handleClick(option)}
          key={option}>
          <span className="text">{text}</span>
        </DropDownItem>
      ))}
    </DropDown>
  );
};
