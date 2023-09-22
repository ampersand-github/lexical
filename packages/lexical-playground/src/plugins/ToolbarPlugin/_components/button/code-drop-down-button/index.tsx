/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import {$getNodeByKey, LexicalEditor} from 'lexical';
import * as React from 'react';
import {useCallback} from 'react';

import DropDown, {DropDownItem} from '../../../../../ui/DropDown';
import {dropDownActiveClass} from '../../../index';

type Props = {
  disabled: boolean;
  activeEditor: LexicalEditor;
  codeLanguage: string;
  selectedElementKey: string | null;
};

export const CodeDropDownButton = ({
  disabled,
  activeEditor,
  codeLanguage,
  selectedElementKey,
}: Props) => {
  const getCodeLanguageOptions = (): [string, string][] => {
    const options: [string, string][] = [];

    for (const [lang, friendlyName] of Object.entries(
      CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    )) {
      options.push([lang, friendlyName]);
    }

    return options;
  };

  const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );
  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item code-language"
      buttonLabel={getLanguageFriendlyName(codeLanguage)}
      buttonAriaLabel="Select language">
      {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
        return (
          <DropDownItem
            className={`item ${dropDownActiveClass(value === codeLanguage)}`}
            onClick={() => onCodeLanguageSelect(value)}
            key={value}>
            <span className="text">{name}</span>
          </DropDownItem>
        );
      })}
    </DropDown>
  );
};
