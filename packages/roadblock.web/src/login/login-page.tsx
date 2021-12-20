import { CircularProgress, Grid } from '@mui/material';
import { IZLogin } from '@zthun/works.core';
import { ZAlertBuilder } from '@zthun/works.message';
import { useAlertService, useErrorHandler, useProfileAndWatch, useProfileService, ZLoginTabs } from '@zthun/works.react';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

/**
 * Renders the login page.
 *
 * @returns The jsx that represents the login page.
 */
export function ZLoginPage(): JSX.Element {
  const [working, setWorking] = useState(false);
  const logged = useProfileAndWatch();
  const profileSvc = useProfileService();
  const alerts = useAlertService();
  const errors = useErrorHandler();

  /**
   * Handles the login request.
   *
   * @param login The credentials to post to the tokens service.
   *
   * @returns A promise that resolves when the request completes.
   */
  async function handleLogin(login: IZLogin) {
    try {
      setWorking(true);
      const profile = await profileSvc.login(login);
      alerts.create(new ZAlertBuilder().success().message('Login successful.').build());
      setWorking(false);
      logged.set(profile);
    } catch (err) {
      errors.handle(err);
      setWorking(false);
    }
  }

  /**
   * Creates a new account.
   *
   * @param login The credentials to create the profile from.
   *
   * @returns A promise that resolves when the request completes.
   */
  async function handleCreate(login: IZLogin) {
    try {
      setWorking(true);
      const profile = await profileSvc.create(login);
      await profileSvc.login(login);
      alerts.create(new ZAlertBuilder().success().message('Account created successfully.').build());
      setWorking(false);
      logged.set(profile);
    } catch (err) {
      errors.handle(err);
      setWorking(false);
    }
  }

  /**
   * Recovers an account from a forgotten password.
   *
   * @param login The login credentials that contain the email to login with.
   *
   * @returns A promise that resolves when the request completes.
   */
  async function handleRecover(login: IZLogin) {
    try {
      setWorking(true);
      await profileSvc.recover(login);
      alerts.create(new ZAlertBuilder().success().message('Check your email, and if it is registered, you will get a one time password you can use to login.').build());
    } catch (err) {
      errors.handle(err);
    } finally {
      setWorking(false);
    }
  }

  /**
   * Creates the loading progress while evaluating the profile state.
   *
   * @returns The jsx that contains the loading progress.
   */
  function createProgressLoading() {
    return <CircularProgress className='ZLoginPage-progress-loading' data-testid='ZLoginPage-progress-loading' color='inherit' />;
  }

  /**
   * Creates the login tabs.
   *
   * @returns The jsx that renders the login tabs.
   */
  function createTabs() {
    return <ZLoginTabs onLoginCredentialsChange={handleLogin} onCreateCredentialsChange={handleCreate} onRecoverCredentialsChange={handleRecover} disabled={working} loading={working} />;
  }

  /**
   * Creates the redirection jsx if the user is already logged in.
   *
   * @returns The jsx that renders a redirection.
   */
  function createRedirect() {
    return <Redirect data-testid='ZLoginPage-redirect-profile' to='/profile' />;
  }

  /**
   * Creates the content jsx based on the state of the profile.
   *
   * @returns The jsx that renders the main content.
   */
  function createContent() {
    if (logged.data) {
      return createRedirect();
    }

    if (logged.data === null) {
      return createTabs();
    }

    return createProgressLoading();
  }

  const content = createContent();

  return (
    <Grid container={true} spacing={3} justifyContent='center' className='ZLoginPage-root' data-testid='ZLoginPage-root'>
      <Grid item={true}>{content}</Grid>
    </Grid>
  );
}
