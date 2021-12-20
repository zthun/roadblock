/* eslint-disable require-jsdoc */
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { IZProfile, ZProfileBuilder } from '@zthun/works.core';
import { IZErrorHandler } from '@zthun/works.error';
import { createMocked } from '@zthun/works.jest';
import { IZAlertService, ZAlertSeverity } from '@zthun/works.message';
import { IZDataState, IZProfileService, ZAlertServiceContext, ZDataState, ZErrorHandlerContext, ZProfileContext, ZProfileServiceContext } from '@zthun/works.react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { lastValueFrom, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v4 } from 'uuid';
import { ZProfilePage } from './profile-page';

describe('ZProfilePage', () => {
  let profile: IZProfile;
  let profileSvc: jest.Mocked<IZProfileService>;
  let state: IZDataState<IZProfile>;
  let alerts: jest.Mocked<IZAlertService>;
  let errors: jest.Mocked<IZErrorHandler>;

  async function createTestTarget() {
    let target: RenderResult;

    await act(async () => {
      target = render(
        <ZErrorHandlerContext.Provider value={errors}>
          <ZAlertServiceContext.Provider value={alerts}>
            <ZProfileContext.Provider value={state}>
              <MemoryRouter>
                <ZProfileServiceContext.Provider value={profileSvc}>
                  <ZProfilePage />
                </ZProfileServiceContext.Provider>
              </MemoryRouter>
            </ZProfileContext.Provider>
          </ZAlertServiceContext.Provider>
        </ZErrorHandlerContext.Provider>
      );
    });

    return target;
  }

  beforeEach(() => {
    profile = undefined;
    state = new ZDataState(profile);
    alerts = createMocked<IZAlertService>(['create']);
    errors = createMocked<IZErrorHandler>(['handle']);

    profileSvc = createMocked<IZProfileService>(['read', 'update', 'delete', 'getAvatar', 'getDisplay', 'login', 'logout', 'activate', 'deactivate', 'reactivate']);
    profileSvc.read.mockResolvedValue(null);
    profileSvc.delete.mockResolvedValue(null);
    profileSvc.update.mockResolvedValue(null);
    profileSvc.getAvatar.mockResolvedValue(null);
    profileSvc.getDisplay.mockResolvedValue('');
    profileSvc.login.mockResolvedValue(null);
    profileSvc.logout.mockResolvedValue(null);
    profileSvc.activate.mockResolvedValue(null);
    profileSvc.deactivate.mockResolvedValue(null);
    profileSvc.reactivate.mockResolvedValue(null);
  });

  async function clickAndWait(text: string, ms: number, target: RenderResult) {
    await act(async () => {
      const btn = target.getByText(text);
      fireEvent.click(btn);
      await lastValueFrom(of(true).pipe(delay(ms)));
    });
  }

  const clickLogoutButton = clickAndWait.bind(null, 'Logout', 10);
  const clickActivateButton = clickAndWait.bind(null, 'Activate', 10);
  const clickReactivateButton = clickAndWait.bind(null, 'Send', 10);
  const clickDeactivateButton = clickAndWait.bind(null, 'Deactivate', 10);
  const checkDeleteConfirm = clickAndWait.bind(null, 'I understand that this action is not reversible.', 2);
  const clickDeleteButton = clickAndWait.bind(null, 'Delete', 10);
  const clickUpdateProfile = clickAndWait.bind(null, 'Update Profile', 10);

  describe('Loading', () => {
    it('renders the loading icon if the login state profile is undefined.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const actual = target.getByTestId('ZProfilePage-progress-profile-loading');
      // Assert
      expect(actual).toBeTruthy();
    });
  });

  describe('Logged out', () => {
    beforeEach(() => {
      profile = null;
      state = new ZDataState(profile);
    });

    it('redirects to the login page.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const loading = target.queryByTestId('ZProfilePage-progress-profile-loading');
      const profileEditor = target.queryByTestId('ZProfileForm-root');
      const activationEditor = target.queryByTestId('ZProfileActivationForm-root');
      const stay = loading || profileEditor || activationEditor;
      // Assert
      expect(stay).toBeFalsy();
    });
  });

  describe('Logged in', () => {
    beforeEach(() => {
      profile = new ZProfileBuilder().email('gambit@marvel.com').active().build();
      state = new ZDataState(profile);
    });

    it('logs the user out of the session.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      await clickLogoutButton(target);
      // Assert
      expect(alerts.create).toHaveBeenCalledWith(expect.objectContaining({ severity: ZAlertSeverity.Success }));
    });

    it('notifies the user when the logout fails.', async () => {
      // Arrange
      const target = await createTestTarget();
      const error = new Error('failed');
      profileSvc.logout.mockRejectedValue(error);
      // Act
      await clickLogoutButton(target);
      // Assert
      expect(errors.handle).toHaveBeenCalledWith(error);
    });
  });

  describe('Not activated', () => {
    beforeEach(() => {
      profile = new ZProfileBuilder().email('gambit@marvel.com').build();
      state = new ZDataState(profile);
    });

    async function setKey(target: RenderResult, key: string) {
      await act(async () => {
        const keyField = target.getByText('Key') as HTMLInputElement;
        keyField.value = key;
        fireEvent.input(keyField);
        await lastValueFrom(of(true).pipe(delay(10)));
      });
    }

    it('activates the profile.', async () => {
      // Arrange
      const target = await createTestTarget();
      const key = v4();
      // Act
      await setKey(target, key);
      await clickActivateButton(target);
      // Assert
      expect(alerts.create).toHaveBeenCalledWith(expect.objectContaining({ severity: ZAlertSeverity.Success }));
    });

    it('notifies the user when activation fails.', async () => {
      // Arrange
      const target = await createTestTarget();
      const key = v4();
      const error = new Error('failed');
      profileSvc.activate.mockRejectedValue(error);
      // Act
      await setKey(target, key);
      await clickActivateButton(target);
      // Assert
      expect(errors.handle).toHaveBeenCalledWith(error);
    });

    it('reactivates the profile.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      await clickReactivateButton(target);
      // Assert
      expect(alerts.create).toHaveBeenCalledWith(expect.objectContaining({ severity: ZAlertSeverity.Success }));
    });

    it('notifies the user when reactivation fails.', async () => {
      // Arrange
      const target = await createTestTarget();
      const error = new Error('failed');
      profileSvc.reactivate.mockRejectedValue(error);
      // Act
      await clickReactivateButton(target);
      // Assert
      expect(errors.handle).toHaveBeenCalledWith(error);
    });
  });

  describe('Activated', () => {
    beforeEach(() => {
      profile = new ZProfileBuilder().active().email('gambit@marvel.com').display('Gambit').build();
      state = new ZDataState(profile);
      profileSvc.update.mockResolvedValue(profile);
    });

    it('shows the profile editor.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const actual = target.getByTestId('ZProfileForm-root');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('deactivates the user account.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      await clickDeactivateButton(target);
      // Assert
      expect(alerts.create).toHaveBeenCalledWith(expect.objectContaining({ severity: ZAlertSeverity.Success }));
    });

    it('notifies the user if the deactivation fails.', async () => {
      // Arrange
      const target = await createTestTarget();
      const error = new Error('failed');
      profileSvc.deactivate.mockRejectedValue(error);
      // Act
      await clickDeactivateButton(target);
      // Assert
      expect(errors.handle).toHaveBeenCalledWith(error);
    });

    it('deletes the user account.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      await checkDeleteConfirm(target);
      await clickDeleteButton(target);
      // Assert
      expect(alerts.create).toHaveBeenCalledWith(expect.objectContaining({ severity: ZAlertSeverity.Success }));
    });

    it('notifies the user if the delete fails.', async () => {
      // Arrange
      const target = await createTestTarget();
      const error = new Error('failed');
      profileSvc.delete.mockRejectedValue(error);
      // Act
      await checkDeleteConfirm(target);
      await clickDeleteButton(target);
      // Assert
      expect(errors.handle).toHaveBeenCalledWith(error);
    });

    it('saves the updated profile.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      await clickUpdateProfile(target);
      // Assert
      expect(alerts.create).toHaveBeenCalledWith(expect.objectContaining({ severity: ZAlertSeverity.Success }));
    });

    it('notifies the user if the update fails.', async () => {
      // Arrange
      const target = await createTestTarget();
      const error = new Error('failed');
      profileSvc.update.mockRejectedValue(error);
      // Act
      await clickUpdateProfile(target);
      // Assert
      expect(errors.handle).toHaveBeenCalledWith(error);
    });
  });
});
