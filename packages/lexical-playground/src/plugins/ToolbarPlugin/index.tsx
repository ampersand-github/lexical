/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {$isCodeNode, CODE_LANGUAGE_MAP} from '@lexical/code';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$isListNode, ListNode} from '@lexical/list';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$isHeadingNode} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
} from '@lexical/selection';
import {$isTableNode} from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  EditorState,
  ElementFormatType,
  ElementNode,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextNode,
  UNDO_COMMAND,
} from 'lexical';
import {useCallback, useEffect, useState} from 'react';
import * as React from 'react';
import {IS_APPLE} from 'shared/environment';

import useModal from '../../hooks/useModal';
import {getSelectedNode} from '../../utils/getSelectedNode';
import {sanitizeUrl} from '../../utils/url';
import {BgColorPickerButton} from './_components/button/bg-color-picker-button';
import {BlockFormatDropDown} from './_components/button/block-format-drop-down';
import {BoldButton} from './_components/button/bold-button';
import {CodeButton} from './_components/button/code-button';
import {CodeDropDownButton} from './_components/button/code-drop-down-button';
import {ElementFormatDropdown} from './_components/button/element-format-button';
import {FontFamilyDropDownButton} from './_components/button/font-family-drop-down-button';
import {FontSizeDropDownButton} from './_components/button/font-size-drop-down-button';
import {FormatDropDownButton} from './_components/button/format-drop-down-button';
import {InsertLinkButton} from './_components/button/insert-link-button';
import {ItalicButton} from './_components/button/italic-button';
import {RedoButton} from './_components/button/redo-button';
import {SpecializedButton} from './_components/button/specialized-button';
import {TextColorPickerButton} from './_components/button/text-color-picker-button';
import {UnderlineButton} from './_components/button/underline-button';
import {UndoButton} from './_components/button/undo-button';

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

export const dropDownActiveClass = (active: boolean) =>
  active ? 'active dropdown-item-active' : '';

const Divider = (): JSX.Element => <div className="divider" />;

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const updateTextFormatStates = (selection: RangeSelection) => {
    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsStrikethrough(selection.hasFormat('strikethrough'));
    setIsSubscript(selection.hasFormat('subscript'));
    setIsSuperscript(selection.hasFormat('superscript'));
    setIsCode(selection.hasFormat('code'));
    setIsRTL($isParentElementRTL(selection));
  };

  const updateLinkState = (node: TextNode | ElementNode) => {
    const parent = node.getParent();
    setIsLink($isLinkNode(parent) || $isLinkNode(node));
  };

  const updateListState = (
    element: LexicalNode,
    anchorNode: TextNode | ElementNode,
  ) => {
    if (!$isListNode(element)) return;
    const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
    setBlockType(parentList ? parentList.getListType() : element.getListType());
  };

  const updateStylingStates = (selection: RangeSelection) => {
    setFontSize(
      $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
    );
    setFontColor(
      $getSelectionStyleValueForProperty(selection, 'color', '#000'),
    );
    setBgColor(
      $getSelectionStyleValueForProperty(selection, 'background-color', '#fff'),
    );
    setFontFamily(
      $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
    );

    const node: TextNode | ElementNode = getSelectedNode(selection);
    setElementFormat(
      $isElementNode(node)
        ? node.getFormatType()
        : node.getParent()?.getFormatType() || 'left',
    );
  };

  const getTargetElement = (node: TextNode | ElementNode) => {
    const isRootOrShadowRootParent = (_node: LexicalNode): boolean => {
      const parent = _node.getParent();
      return !!parent && $isRootOrShadowRoot(parent);
    };

    return node.getKey() === 'root'
      ? (node as ElementNode)
      : $findMatchingParent(node, isRootOrShadowRootParent) ||
          node.getTopLevelElementOrThrow();
  };

  const updateBlockTypeAndCodeLanguage = (element: LexicalNode) => {
    const type = $isHeadingNode(element) ? element.getTag() : element.getType();
    if (type in blockTypeToBlockName) {
      setBlockType(type as keyof typeof blockTypeToBlockName);
    }

    if ($isCodeNode(element)) {
      const languageKey =
        element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
      setCodeLanguage(CODE_LANGUAGE_MAP[languageKey] || languageKey || '');
    }
  };

  const $updateToolbar = useCallback(() => {
    const selection: EditorState['_selection'] = $getSelection();

    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();
    const element = getTargetElement(anchorNode);
    const elementDOM = activeEditor.getElementByKey(element.getKey());

    if (!elementDOM) return;

    updateTextFormatStates(selection);
    updateLinkState(getSelectedNode(selection));

    setRootType(
      $isTableNode($findMatchingParent(anchorNode, $isTableNode))
        ? 'table'
        : 'root',
    );

    setSelectedElementKey(element.getKey());
    updateListState(element, anchorNode);
    updateBlockTypeAndCodeLanguage(element);
    updateStylingStates(selection);
  }, [activeEditor]);

  useEffect(() => {
    const handleSelectionChange = (
      _payload: boolean,
      newEditor: LexicalEditor,
    ): boolean => {
      $updateToolbar();
      setActiveEditor(newEditor);
      return false;
    };

    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      handleSelectionChange,
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    const registerEditableListener = () =>
      editor.registerEditableListener(setIsEditable);

    const registerUpdateListener = () =>
      activeEditor.registerUpdateListener(({editorState}) => {
        editorState.read($updateToolbar);
      });

    const registerUndoCommand = () =>
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      );

    const registerRedoCommand = () =>
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      );

    return mergeRegister(
      registerEditableListener(),
      registerUpdateListener(),
      registerUndoCommand(),
      registerRedoCommand(),
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    const handleKeyCommand = (event: KeyboardEvent): boolean => {
      const {code, ctrlKey, metaKey} = event;
      const isShortcutTriggered = code === 'KeyK' && (ctrlKey || metaKey);
      if (isShortcutTriggered) {
        event.preventDefault();
        const placeholderUrl = 'https://';
        return activeEditor.dispatchCommand(
          TOGGLE_LINK_COMMAND,
          sanitizeUrl(placeholderUrl),
        );
      }
      return false;
    };
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      handleKeyCommand,
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor]);

  return (
    <div className="toolbar">
      <UndoButton
        disabled={!canUndo || !isEditable}
        onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND, undefined)}
        isApple={IS_APPLE}
      />
      <RedoButton
        disabled={!canRedo || !isEditable}
        onClick={() => activeEditor.dispatchCommand(REDO_COMMAND, undefined)}
        isApple={IS_APPLE}
      />
      <Divider />
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            rootType={rootType}
            editor={editor}
          />
          <Divider />
        </>
      )}
      {blockType === 'code' ? (
        <CodeDropDownButton
          disabled={!isEditable}
          codeLanguage={codeLanguage}
          activeEditor={activeEditor}
          selectedElementKey={selectedElementKey}
        />
      ) : (
        <>
          <FontFamilyDropDownButton
            disabled={!isEditable}
            value={fontFamily}
            editor={editor}
          />
          <FontSizeDropDownButton
            disabled={!isEditable}
            value={fontSize}
            editor={editor}
          />
          <Divider />
          <BoldButton
            disabled={!isEditable}
            activeEditor={activeEditor}
            isApple={IS_APPLE}
            isBold={isBold}
          />
          <ItalicButton
            disabled={!isEditable}
            activeEditor={activeEditor}
            isApple={IS_APPLE}
            isItalic={isItalic}
          />
          <UnderlineButton
            disabled={!isEditable}
            activeEditor={activeEditor}
            isApple={IS_APPLE}
            isUnderline={isUnderline}
          />
          <CodeButton
            disabled={!isEditable}
            activeEditor={activeEditor}
            isCode={isCode}
          />
          <InsertLinkButton
            disabled={!isEditable}
            isInsertLink={isLink}
            activeEditor={activeEditor}
          />
          <TextColorPickerButton
            disabled={!isEditable}
            color={fontColor}
            activeEditor={activeEditor}
          />
          <BgColorPickerButton
            disabled={!isEditable}
            bgColor={fontColor}
            activeEditor={activeEditor}
          />
          <FormatDropDownButton
            disabled={!isEditable}
            activeEditor={activeEditor}
            isStrikethrough={isStrikethrough}
            isSubscript={isSubscript}
            isSuperscript={isSuperscript}
          />

          <Divider />
          <SpecializedButton
            disabled={!isEditable}
            activeEditor={activeEditor}
          />
        </>
      )}
      <Divider />
      <ElementFormatDropdown
        disabled={!isEditable}
        value={elementFormat}
        editor={editor}
        isRTL={isRTL}
      />

      {modal}
    </div>
  );
}
