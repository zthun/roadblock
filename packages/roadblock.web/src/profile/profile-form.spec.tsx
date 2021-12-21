/* eslint-disable require-jsdoc */

import { fireEvent, render, RenderResult, waitForElementToBeRemoved } from '@testing-library/react';
import { IZProfile, ZProfileBuilder } from '@zthun/works.core';
import { IZImageReader } from '@zthun/works.draw';
import { createMocked } from '@zthun/works.jest';
import { ZImageReaderContext } from '@zthun/works.react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ZProfileForm } from './profile-form';

describe('ZProfileForm', () => {
  let onProfileChange: jest.Mock;
  let imageReader: jest.Mocked<IZImageReader>;
  let hideAccountInformation: boolean;
  let hidePassword: boolean;
  let disabled: boolean;
  let profile: IZProfile;

  async function createTestTarget() {
    return render(
      <ZImageReaderContext.Provider value={imageReader}>
        <ZProfileForm profile={profile} onProfileChange={onProfileChange} disabled={disabled} hideAccountInformation={hideAccountInformation} hidePassword={hidePassword} />
      </ZImageReaderContext.Provider>
    );
  }

  function getField(rend: RenderResult, id: string) {
    const input = rend.getByTestId(id).getElementsByTagName('input').item(0);
    return input;
  }

  function setField(rend: RenderResult, id: string, val: string) {
    const input = getField(rend, id);
    input.value = val;
    fireEvent.input(input);
  }

  function clickAction(rend: RenderResult) {
    const action = rend.getByTestId('ZProfileForm-root');
    fireEvent.submit(action);
  }

  beforeEach(() => {
    hideAccountInformation = undefined;
    hidePassword = undefined;
    disabled = undefined;
    profile = new ZProfileBuilder().email('gambit@marvel.com').display('Gambit').build();

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    imageReader = createMocked<IZImageReader>(['read']);
    imageReader.read.mockResolvedValue(canvas);

    onProfileChange = undefined;
  });

  describe('Disabled', () => {
    beforeEach(() => {
      disabled = true;
    });

    async function assertDisablesField(id: string) {
      // Arrange
      const target = await createTestTarget();
      // Act
      const input = getField(target, id);
      // Assert
      expect(input.disabled).toBeTruthy();
    }

    it('should disable the display field.', async () => {
      await assertDisablesField('ZProfileForm-input-display');
    });

    it('should disable the email field.', async () => {
      await assertDisablesField('ZProfileForm-input-email');
    });

    it('should disable the password field.', async () => {
      await assertDisablesField('ZProfileForm-input-password');
    });

    it('should disable the confirm field.', async () => {
      await assertDisablesField('ZProfileForm-input-confirm');
    });
  });

  describe('Visibility', () => {
    async function assertFieldHidden(id: string) {
      // Arrange
      const target = await createTestTarget();
      // Act
      const actual = target.queryByTestId(id);
      // Assert
      expect(actual).toBeFalsy();
    }

    describe('Account Information', () => {
      beforeEach(() => {
        hideAccountInformation = true;
      });

      it('should hide the display if hideAccountInformation is true.', async () => {
        await assertFieldHidden('ZProfileForm-input-display');
      });

      it('should hide the email if hideAccountInformation is true.', async () => {
        await assertFieldHidden('ZProfileForm-input-email');
      });
    });

    describe('Password', () => {
      beforeEach(() => {
        hidePassword = true;
      });

      it('should hide the password field if hidePassword is true.', async () => {
        await assertFieldHidden('ZProfileForm-input-password');
      });

      it('should hide the confirm field if hidePassword is true.', async () => {
        await assertFieldHidden('ZProfileForm-input-confirm');
      });
    });
  });

  describe('Email', () => {
    it('should show the email warning if the email has changed.', async () => {
      // Arrange
      const target = await createTestTarget();
      const updated = 'wolverine@marvel.com';
      // Act
      await act(async () => {
        setField(target, 'ZProfileForm-input-email', updated);
      });
      const actual = target.getByTestId('ZProfileForm-alert-email-dirty-true');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('should not show the email warning if the email is the original email.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const actual = target.getByTestId('ZProfileForm-alert-email-dirty-false');
      // Assert
      expect(actual).toBeTruthy();
    });
  });

  describe('Avatar', () => {
    beforeEach(() => {
      profile = new ZProfileBuilder().copy(profile).avatar('https://steamavatar.io/img/14777429602y3IT.jpg').build();
    });

    it('should show the user avatar.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const actual = target.getByTestId('ZProfileForm-avatar');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('should open the avatar editor when the user clicks the avatar icon.', async () => {
      // Arrange
      const target = await createTestTarget();
      const icon = target.getByTestId('ZProfileForm-avatar');
      // Act
      await act(async () => {
        fireEvent.click(icon);
        await of(true).pipe(delay(0)).toPromise();
      });
      const actual = target.getByTestId('ZProfileForm-avatar-dialog');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('should close the avatar editor when the user clicks the Update Avatar button.', async () => {
      // Arrange
      const target = await createTestTarget();
      const icon = target.getByTestId('ZProfileForm-avatar');
      // Act
      await act(async () => {
        fireEvent.click(icon);
      });
      await act(async () => {
        const btn = target.getByText('Update Avatar');
        fireEvent.click(btn);
        await waitForElementToBeRemoved(target.queryByTestId('ZProfileForm-avatar-dialog'));
      });
      const actual = target.queryByTestId('ZProfileForm-avatar-dialog');
      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('Save', () => {
    beforeEach(() => {
      onProfileChange = jest.fn();
    });

    it('should fire the profileChange method with the updated profile.', async () => {
      // Arrange
      const target = await createTestTarget();
      const expected = new ZProfileBuilder().display('Wolverine').email('wolverine@marvel.com').password('sucks-password').avatar(profile.avatar).confirm('sucks-password').build();
      // Act
      await act(async () => {
        setField(target, 'ZProfileForm-input-display', expected.display);
        setField(target, 'ZProfileForm-input-email', expected.email);
        setField(target, 'ZProfileForm-input-password', expected.password);
        setField(target, 'ZProfileForm-input-confirm', expected.confirm);
      });
      clickAction(target);
      // Assert
      expect(onProfileChange).toHaveBeenCalledWith(expected);
    });

    it('should fire the profileChange method with a null display name if the display is empty.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      await act(async () => {
        setField(target, 'ZProfileForm-input-display', '');
      });
      clickAction(target);
      // Assert
      expect(onProfileChange).toHaveBeenCalledWith(expect.objectContaining({ display: null }));
    });

    it('should fire the profileChange method without the password or confirm password fields if the password and confirm password fields are empty.', async () => {
      // Arrange
      const target = await createTestTarget();
      const expected = new ZProfileBuilder().password('not-very-secure').autoConfirm().build();
      // Act
      await act(async () => {
        setField(target, 'ZProfileForm-input-password', expected.password);
        setField(target, 'ZProfileForm-input-confirm', expected.confirm);
      });
      clickAction(target);
      // Assert
      expect(onProfileChange).toHaveBeenCalledWith(expect.objectContaining({ password: expected.password, confirm: expected.confirm }));
    });

    it('should fire the profileChange method with the password and confirm fields set if the password is not empty.', async () => {
      // Arrange
      const target = await createTestTarget();
      const password = 'not-very-secure';
      // Act
      await act(async () => {
        setField(target, 'ZProfileForm-input-password', password);
        setField(target, 'ZProfileForm-input-confirm', '');
      });
      clickAction(target);
      // Assert
      expect(onProfileChange).toHaveBeenCalledWith(expect.objectContaining({ password, confirm: '' }));
    });

    it('should fire the profileChange method with the password and confirm fields set if the confirm is not empty.', async () => {
      // Arrange
      const target = await createTestTarget();
      const password = 'not-very-secure';
      // Act
      await act(async () => {
        setField(target, 'ZProfileForm-input-password', '');
        setField(target, 'ZProfileForm-input-confirm', password);
      });
      clickAction(target);
      // Assert
      expect(onProfileChange).toHaveBeenCalledWith(expect.objectContaining({ password: '', confirm: password }));
    });

    it('should file the profileChange method with an empty email if the email has not changed.', async () => {
      // Arrange
      const target = await createTestTarget();
      const expected = new ZProfileBuilder().display(profile.display).build();
      // Act
      await act(async () => {
        setField(target, 'ZProfileForm-input-display', expected.display);
        setField(target, 'ZProfileForm-input-email', profile.email);
      });
      clickAction(target);
      // Assert
      expect(onProfileChange).toHaveBeenCalledWith(expected);
    });
  });
});
