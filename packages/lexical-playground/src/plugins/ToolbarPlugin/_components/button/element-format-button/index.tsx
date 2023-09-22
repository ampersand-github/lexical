/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import * as React from 'react';

import DropDown, {DropDownItem} from '../../../../../ui/DropDown';

const ELEMENT_FORMAT_OPTIONS: {
  [key: string]: {icon: string; name: string};
} = {
  center: {
    icon: 'center-align',
    name: 'Center Align',
  },
  justify: {
    icon: 'justify-align',
    name: 'Justify Align',
  },
  left: {
    icon: 'left-align',
    name: 'Left Align',
  },
  right: {
    icon: 'right-align',
    name: 'Right Align',
  },
};

export const ElementFormatDropdown = ({
  editor,
  value,
  isRTL,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
  disabled: boolean;
}) => (
  <DropDown
    disabled={disabled}
    buttonLabel={ELEMENT_FORMAT_OPTIONS[value].name}
    buttonIconClassName={`icon ${ELEMENT_FORMAT_OPTIONS[value].icon}`}
    buttonClassName="toolbar-item spaced alignment"
    buttonAriaLabel="Formatting options for text alignment">
    <DropDownItem
      onClick={() => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
      }}
      className="item">
      <i className="icon left-align" />
      <span className="text">Left Align</span>
    </DropDownItem>
    <DropDownItem
      onClick={() => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
      }}
      className="item">
      <i className="icon center-align" />
      <span className="text">Center Align</span>
    </DropDownItem>
    <DropDownItem
      onClick={() => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
      }}
      className="item">
      <i className="icon right-align" />
      <span className="text">Right Align</span>
    </DropDownItem>
    <DropDownItem
      onClick={() => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
      }}
      className="item">
      <i className="icon justify-align" />
      <span className="text">Justify Align</span>
    </DropDownItem>
    <DropDownItem
      onClick={() => {
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
      }}
      className="item">
      <i className={'icon ' + (isRTL ? 'indent' : 'outdent')} />
      <span className="text">Outdent</span>
    </DropDownItem>
    <DropDownItem
      onClick={() => {
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
      }}
      className="item">
      <i className={'icon ' + (isRTL ? 'outdent' : 'indent')} />
      <span className="text">Indent</span>
    </DropDownItem>
  </DropDown>
);
