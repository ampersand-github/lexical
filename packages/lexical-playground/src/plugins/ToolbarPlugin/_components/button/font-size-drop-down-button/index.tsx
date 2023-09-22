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
import {dropDownActiveClass} from '../../..';

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
];

type FontSizeProps = {
  editor: LexicalEditor;
  value: string;
  disabled?: boolean;
};

export const FontSizeDropDownButton = ({
  editor,
  value,
  disabled = false,
}: FontSizeProps): JSX.Element => {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {'font-size': option});
        }
      });
    },
    [editor],
  );

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item font-size"
      buttonLabel={value}
      buttonIconClassName="icon block-type font-size"
      buttonAriaLabel="Formatting options for font size">
      {FONT_SIZE_OPTIONS.map(([option, text]) => (
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
