/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as React from 'react';

type Props = {
  disabled: boolean;
  onClick: () => void;
  isApple: boolean;
};

export const UndoButton = ({disabled, onClick, isApple}: Props) => (
  <button
    disabled={disabled}
    onClick={onClick}
    title={isApple ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
    type="button"
    className="toolbar-item spaced"
    aria-label="Undo">
    <i className="format undo" />
  </button>
);
