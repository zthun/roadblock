/* eslint-disable require-jsdoc */

import { fireEvent, render } from '@testing-library/react';
import { IZProfileActivation, ZProfileActivationBuilder } from '@zthun/works.core';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { v4 } from 'uuid';
import { ZProfileActivationForm } from './profile-activation-form';

describe('ZProfileActivationForm', () => {
  let disabled: boolean;
  let activation: IZProfileActivation;
  let onActivationChange: jest.Mock;

  async function createTestTarget() {
    return render(<ZProfileActivationForm activation={activation} onActivationChange={onActivationChange} disabled={disabled} />);
  }

  async function assertDisabled(testId: string, tag: keyof HTMLElementTagNameMap) {
    // Arrange
    const target = await createTestTarget();
    // Act
    const element = target.getByTestId(testId);
    const inputElement = tag ? (element.getElementsByTagName(tag).item(0) as HTMLInputElement) : (element as HTMLInputElement);
    const actual = inputElement.disabled;
    // Assert
    expect(actual).toBeTruthy();
  }

  beforeEach(() => {
    disabled = undefined;
    activation = new ZProfileActivationBuilder().email('gambit@marvel.com').build();
    onActivationChange = undefined;
  });

  it('renders the form.', async () => {
    // Arrange
    const target = await createTestTarget();
    // Act
    const actual = target.getByTestId('ZProfileActivationForm-root');
    // Assert
    expect(actual).toBeTruthy();
  });

  describe('Activation', () => {
    beforeEach(() => {
      onActivationChange = jest.fn();
    });

    it('should update the activation.', async () => {
      // Arrange
      const target = await createTestTarget();
      const expected = new ZProfileActivationBuilder().copy(activation).key(v4()).build();
      // Act
      await act(async () => {
        const field = target.getByTestId('ZProfileActivationForm-input-key').getElementsByTagName('input').item(0);
        field.value = expected.key;
        fireEvent.input(field);
      });
      const button = target.getByTestId('ZProfileActivationForm-root');
      fireEvent.submit(button);
      // Assert
      expect(onActivationChange).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should update just the key if the activation is null.', async () => {
      // Arrange
      activation = null;
      const target = await createTestTarget();
      const expected = new ZProfileActivationBuilder().key(v4()).build();
      // Act
      await act(async () => {
        const field = target.getByTestId('ZProfileActivationForm-input-key').getElementsByTagName('input').item(0);
        field.value = expected.key;
        fireEvent.input(field);
      });
      const button = target.getByTestId('ZProfileActivationForm-root');
      fireEvent.submit(button);
      // Assert
      expect(onActivationChange).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should disable the activate button if the key is falsy.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const button = target.getByTestId('ZPaperCard-btn-action') as HTMLButtonElement;
      // Assert
      expect(button.disabled).toBeTruthy();
    });

    it('should enable the activate button if the key is truthy.', async () => {
      // Arrange
      const target = await createTestTarget();
      await act(async () => {
        const field = target.getByTestId('ZProfileActivationForm-input-key').getElementsByTagName('input').item(0);
        field.value = v4();
        fireEvent.input(field);
      });
      // Act
      const button = target.getByTestId('ZPaperCard-btn-action') as HTMLButtonElement;
      // Assert
      expect(button.disabled).toBeFalsy();
    });
  });

  describe('Disabled', () => {
    beforeEach(() => {
      disabled = true;
    });

    it('should disable the key input.', () => {
      assertDisabled('ZProfileActivationForm-input-key', 'input');
    });
  });
});
