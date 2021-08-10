/* eslint-disable require-jsdoc */
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { IZProfile, ZProfileBuilder } from '@zthun/works.core';
import { IZAlertStack, IZDataState, ZAlertSeverity, ZAlertStack, ZAlertStackContext, ZDataState, ZLoginStateContext } from '@zthun/works.react';
import Axios from 'axios';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v4 } from 'uuid';
import { ZRoadblockProfilePage } from './profile-page';

jest.mock('axios');

describe('ZRoadblockProfilePage', () => {
  let profile: IZProfile;
  let state: IZDataState<IZProfile>;
  let alerts: IZAlertStack;

  async function createTestTarget() {
    const target = render(
      <ZAlertStackContext.Provider value={alerts}>
        <ZLoginStateContext.Provider value={state}>
          <MemoryRouter>
            <ZRoadblockProfilePage />
          </MemoryRouter>
        </ZLoginStateContext.Provider>
      </ZAlertStackContext.Provider>
    );
    return target;
  }

  beforeEach(() => {
    profile = undefined;
    state = new ZDataState(profile);
    alerts = new ZAlertStack(1);

    (Axios.get as jest.Mock).mockClear();
    (Axios.put as jest.Mock).mockClear();
    (Axios.post as jest.Mock).mockClear();
    (Axios.delete as jest.Mock).mockClear();
  });

  describe('Loading', () => {
    it('renders the loading icon if the login state profile is undefined.', async () => {
      // Arrange
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
      });
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
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
      });
      const loading = target.queryByTestId('ZProfilePage-progress-profile-loading');
      const profileEditor = target.queryByTestId('ZProfileForm-root');
      const activationEditor = target.queryByTestId('ZProfileActivationForm-root');
      const stay = loading || profileEditor || activationEditor;
      // Assert
      expect(stay).toBeFalsy();
    });
  });

  describe('Not activated', () => {
    beforeEach(() => {
      profile = new ZProfileBuilder().email('gambit@marvel.com').build();
      state = new ZDataState(profile);
    });

    async function setKey(target: RenderResult, key: string) {
      const keyField = target.getByText('Key') as HTMLInputElement;
      keyField.value = key;
      fireEvent.input(keyField);
      await of(true).pipe(delay(0)).toPromise();
    }

    async function clickActivateButton(target: RenderResult) {
      const activation = target.getByText('Activate');
      fireEvent.submit(activation);
      await of(true).pipe(delay(0)).toPromise();
    }

    async function clickReactivateButton(target: RenderResult) {
      const reactivate = target.getByText('Send');
      fireEvent.click(reactivate);
      await of(true).pipe(delay(0)).toPromise();
    }

    it('activates the profile.', async () => {
      // Arrange
      let target: RenderResult;
      const key = v4();
      // Act
      await act(async () => {
        target = await createTestTarget();
        await setKey(target, key);
        await clickActivateButton(target);
      });
      // Assert
      expect(Axios.put).toHaveBeenCalledWith(expect.stringContaining('profiles/activations'), expect.objectContaining({ key }));
    });

    it('notifies the user that activation was successful.', async () => {
      // Arrange
      let target: RenderResult;
      const key = v4();
      // Act
      await act(async () => {
        target = await createTestTarget();
        await setKey(target, key);
        await clickActivateButton(target);
      });
      const actual = alerts.list[0];
      // Assert
      expect(actual.severity).toEqual(ZAlertSeverity.Success);
    });

    it('notifies the user when activation fails.', async () => {
      // Arrange
      let target: RenderResult;
      const key = v4();
      Axios.put = jest.fn().mockRejectedValue('failed');
      // Act
      await act(async () => {
        target = await createTestTarget();
        await setKey(target, key);
        await clickActivateButton(target);
      });
      const actual = alerts.list[0];
      // Assert
      expect(actual.severity).toEqual(ZAlertSeverity.Error);
    });

    it('reactivates the profile.', async () => {
      // Arrange
      let target: RenderResult;
      const expected = state.data.email;
      // Act
      await act(async () => {
        target = await createTestTarget();
        await clickReactivateButton(target);
      });
      // Assert
      expect(Axios.post).toHaveBeenCalledWith(expect.stringContaining('profiles/activations'), expect.objectContaining({ email: expected }));
    });

    it('notifies the user that activation was successful.', async () => {
      // Arrange
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
        await clickReactivateButton(target);
      });
      const actual = alerts.list[0];
      // Assert
      expect(actual.severity).toEqual(ZAlertSeverity.Success);
    });

    it('notifies the user when reactivation fails.', async () => {
      // Arrange
      let target: RenderResult;
      Axios.post = jest.fn().mockRejectedValue('failed');
      // Act
      await act(async () => {
        target = await createTestTarget();
        await clickReactivateButton(target);
      });
      const actual = alerts.list[0];
      // Assert
      expect(actual.severity).toEqual(ZAlertSeverity.Error);
    });

    it('logs the user out of the session.', async () => {
      // Arrange
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
        const logoutBtn = target.getByText('Logout');
        fireEvent.click(logoutBtn);
      });
      // Assert
      expect(Axios.delete).toHaveBeenCalledWith(expect.stringContaining('tokens'));
    });
  });

  describe('Activated', () => {
    beforeEach(() => {
      profile = new ZProfileBuilder().active().email('gambit@marvel.com').display('Gambit').build();
      state = new ZDataState(profile);
    });

    it('shows the profile editor.', async () => {
      // Arrange
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
      });
      const actual = target.getByTestId('ZProfileForm-root');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('deactivates the user account.', async () => {
      // Arrange
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
        const deactivateBtn = target.getByText('Deactivate');
        fireEvent.click(deactivateBtn);
      });
      // Assert
      expect(Axios.delete).toHaveBeenCalledWith(expect.stringContaining('profiles/activations'));
    });

    it('deletes the user account.', async () => {
      // Arrange
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
        const confirm = target.getByText('I understand that this action is not reversible.');
        fireEvent.click(confirm);
        const deleteBtn = target.getByText('Delete');
        fireEvent.click(deleteBtn);
      });
      // Assert
      expect(Axios.delete).toHaveBeenCalledWith(expect.stringContaining('profiles'));
    });

    it('saves the updated profile.', async () => {
      // Arrange
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
        const saveBtn = target.getByText('Update Profile');
        fireEvent.submit(saveBtn);
      });
      // Assert
      expect(Axios.put).toHaveBeenCalledWith(expect.stringContaining('profiles'), expect.anything());
    });

    it('logs the user out of the session.', async () => {
      // Arrange
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
        const logoutBtn = target.getByText('Logout');
        fireEvent.click(logoutBtn);
      });
      // Assert
      expect(Axios.delete).toHaveBeenCalledWith(expect.stringContaining('tokens'));
    });
  });
});
