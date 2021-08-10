/* eslint-disable require-jsdoc */
import { fireEvent, render } from '@testing-library/react';
import { IZProfile, ZProfileBuilder } from '@zthun/works.core';
import { IZAlertStack, IZDataState, ZAlertStack, ZAlertStackContext, ZDataState, ZLoginStateContext } from '@zthun/works.react';
import Axios from 'axios';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import { ZRoadblockMenu } from './menu';

jest.mock('axios');

describe('ZthunworksMenu', () => {
  let history: MemoryHistory;
  let alerts: IZAlertStack;
  let loginState: IZDataState<IZProfile>;

  async function createTestTarget() {
    return render(
      <ZAlertStackContext.Provider value={alerts}>
        <ZLoginStateContext.Provider value={loginState}>
          <Router history={history}>
            <ZRoadblockMenu />
          </Router>
        </ZLoginStateContext.Provider>
      </ZAlertStackContext.Provider>
    );
  }

  beforeEach(() => {
    history = createMemoryHistory();
    loginState = new ZDataState<IZProfile>();
    alerts = new ZAlertStack();

    (Axios.delete as jest.Mock).mockClear();
  });

  describe('Profile state', () => {
    describe('Logged out.', () => {
      beforeEach(() => {
        loginState = new ZDataState<IZProfile>(null);
      });

      it('should move to the login page when the profile menu is clicked.', async () => {
        // Arrange
        const target = await createTestTarget();
        // Act
        await act(async () => {
          const actual = target.getByTestId('ZProfileButton-login');
          fireEvent.click(actual);
        });
        // Assert
        expect(history.location.pathname).toEqual('/login');
      });
    });

    describe('Logged in.', () => {
      let menu: string;

      beforeEach(() => {
        menu = 'Gambit';
        loginState = new ZDataState(new ZProfileBuilder().email('gambit@marvel.com').display(menu).build());
      });

      it('should move to the profile page when the profile menu item is clicked.', async () => {
        // Arrange
        const target = await createTestTarget();
        // Act
        await act(async () => {
          const btn = target.getByTestId('ZProfileButton-avatar');
          fireEvent.click(btn);
        });
        // Assert
        expect(history.location.pathname).toEqual('/profile');
      });
    });
  });
});
