/* eslint-disable require-jsdoc */
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { IZProfile, ZProfileBuilder } from '@zthun/works.core';
import { IZAlertStack, IZDataState, ZAlertSeverity, ZAlertStack, ZAlertStackContext, ZDataState, ZLoginStateContext } from '@zthun/works.react';
import Axios from 'axios';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ZRoadblockLoginPage } from './login-page';

jest.mock('axios');

describe('ZLoginPage', () => {
  let state: IZDataState<IZProfile>;
  let alerts: IZAlertStack;

  async function createTestTarget() {
    const target = render(
      <ZAlertStackContext.Provider value={alerts}>
        <ZLoginStateContext.Provider value={state}>
          <MemoryRouter>
            <ZRoadblockLoginPage />
          </MemoryRouter>
        </ZLoginStateContext.Provider>
      </ZAlertStackContext.Provider>
    );
    return target;
  }

  beforeEach(() => {
    state = new ZDataState<IZProfile>(null);
    alerts = new ZAlertStack();
  });

  describe('Display', () => {
    it('shows a circular progress if the profile is loading.', async () => {
      // Arrange
      state = new ZDataState<IZProfile>(undefined);
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
      });
      const actual = target.getByTestId('ZLoginPage-progress-loading');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('shows the login tabs if the user is not logged in.', async () => {
      // Arrange
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
      });
      const actual = target.getByTestId('ZLoginTabs-root');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('redirects to the profile page if the user is logged in.', async () => {
      // Arrange
      state = new ZDataState(new ZProfileBuilder().display('Gambit').email('gambit@marvel.com').build());
      let target: RenderResult;
      // Act
      await act(async () => {
        target = await createTestTarget();
      });
      const progress = target.queryByTestId('ZLoginPage-progress-loading');
      const tabs = target.queryByTestId('ZLoginPage-tabs');
      // Assert
      expect(progress).toBeFalsy();
      expect(tabs).toBeFalsy();
    });
  });

  describe('Tabs', () => {
    beforeEach(() => {
      Axios.post = jest.fn().mockResolvedValue(Promise.resolve());
    });

    function getActionButton(index: number, target: RenderResult) {
      return target.getAllByTestId('ZPaperCard-btn-action')[index];
    }

    const getLoginActionButton = getActionButton.bind(null, 0);
    const getCreateActionButton = getActionButton.bind(null, 1);
    const getRecoverActionButton = getActionButton.bind(null, 2);

    describe('Login', () => {
      it('should run the login.', async () => {
        // Arrange
        let target: RenderResult;
        await act(async () => {
          target = await createTestTarget();
          // Act
          fireEvent.submit(getLoginActionButton(target));
        });
        // Assert
        expect(Axios.post).toHaveBeenCalledWith(expect.stringContaining('tokens'), expect.anything());
      });

      it('should notify the user of a successful login.', async () => {
        // Arrange
        let target: RenderResult;
        await act(async () => {
          target = await createTestTarget();
          // Act
          fireEvent.submit(getLoginActionButton(target));
          await of(true).pipe(delay(0)).toPromise();
        });
        // Assert
        expect(alerts.list[0].severity).toEqual(ZAlertSeverity.Success);
      });

      it('should alert the user if the login fails.', async () => {
        // Arrange
        Axios.post = jest.fn().mockRejectedValue('failed');
        let target: RenderResult;
        await act(async () => {
          target = await createTestTarget();
          // Act
          fireEvent.submit(getLoginActionButton(target));
          await of(true).pipe(delay(0)).toPromise();
        });
        // Assert
        expect(alerts.list[0].severity).toEqual(ZAlertSeverity.Error);
      });
    });

    describe('Create', () => {
      it('should run the create user workflow.', async () => {
        // Arrange
        let target: RenderResult;
        await act(async () => {
          target = await createTestTarget();
          // Act
          fireEvent.submit(getCreateActionButton(target));
        });
        // Assert
        expect(Axios.post).toHaveBeenCalledWith(expect.stringContaining('profiles'), expect.anything());
      });

      it('should notify the user of a successful creation.', async () => {
        // Arrange
        let target: RenderResult;
        await act(async () => {
          target = await createTestTarget();
          // Act
          fireEvent.submit(getCreateActionButton(target));
          await of(true).pipe(delay(0)).toPromise();
        });
        // Assert
        expect(alerts.list[0].severity).toEqual(ZAlertSeverity.Success);
      });

      it('should alert the user if the login fails.', async () => {
        // Arrange
        Axios.post = jest.fn().mockRejectedValue('failed');
        let target: RenderResult;
        await act(async () => {
          target = await createTestTarget();
          // Act
          fireEvent.submit(getCreateActionButton(target));
          await of(true).pipe(delay(0)).toPromise();
        });
        // Assert
        expect(alerts.list[0].severity).toEqual(ZAlertSeverity.Error);
      });
    });

    describe('Recover', () => {
      it('should run the recover workflow.', async () => {
        // Arrange
        let target: RenderResult;
        await act(async () => {
          target = await createTestTarget();
          // Act
          fireEvent.submit(getRecoverActionButton(target));
        });
        // Assert
        expect(Axios.post).toHaveBeenCalledWith(expect.stringContaining('profiles/recoveries'), expect.anything());
      });
      it('should alert the user that the password recovery has been sent to their email.', async () => {
        // Arrange
        let target: RenderResult;
        await act(async () => {
          target = await createTestTarget();
          // Act
          fireEvent.submit(getRecoverActionButton(target));
          await of(true).pipe(delay(0)).toPromise();
        });
        // Assert
        expect(alerts.list[0].severity).toEqual(ZAlertSeverity.Success);
      });

      it('should alert the user if an error occurs during the password recovery phase.', async () => {
        // Arrange
        Axios.post = jest.fn().mockRejectedValue('failed');
        let target: RenderResult;
        await act(async () => {
          target = await createTestTarget();
          // Act
          fireEvent.submit(getRecoverActionButton(target));
          await of(true).pipe(delay(0)).toPromise();
        });
        // Assert
        expect(alerts.list[0].severity).toEqual(ZAlertSeverity.Error);
      });
    });
  });
});
