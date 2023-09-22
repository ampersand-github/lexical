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

export const RedoButton = ({disabled, onClick, isApple}: Props) => (
  <button
    disabled={disabled}
    onClick={onClick}
    title={isApple ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
    type="button"
    className="toolbar-item"
    aria-label="Redo">
    <i className="format redo" />
  </button>
);
