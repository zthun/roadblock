import { CircularProgress, Grid } from '@material-ui/core';
import { IZLogin, IZProfile } from '@zthun/works.core';
import { tryGetProfile, useAlertStack, useLoginState, ZAlertBuilder, ZLoginTabs } from '@zthun/works.react';
import { ZUrlBuilder } from '@zthun/works.url';
import Axios from 'axios';
import { get } from 'lodash';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

/**
 * Renders the login page.
 *
 * @returns The jsx that represents the login page.
 */
export function ZRoadblockLoginPage(): JSX.Element {
  const [working, setWorking] = useState(false);
  const logged = useLoginState();
  const alerts = useAlertStack();

  /**
   * Handles the login request.
   *
   * @param login The credentials to post to the tokens service.
   *
   * @returns A promise that resolves when the request completes.
   */
  async function handleLogin(login: IZLogin) {
    try {
      const url = new ZUrlBuilder().api().append('tokens').build();
      setWorking(true);
      // await createToken(login);
      await Axios.post<IZProfile>(url, login);
      logged.set();
      const profile = await tryGetProfile();
      logged.set(profile);
      alerts.add(new ZAlertBuilder().success().message('Login successful.').build());
    } catch (err) {
      alerts.add(new ZAlertBuilder().error().message(get(err, 'response.data.message', err)).build());
    } finally {
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
    setWorking(true);

    try {
      const url = new ZUrlBuilder().api().append('profiles').build();
      // await createProfile(login);
      await Axios.post(url, login);
      alerts.add(new ZAlertBuilder().success().message('Account created successfully.').build());
    } catch (err) {
      alerts.add(new ZAlertBuilder().error().message(get(err, 'response.data.message', err)).build());
    }

    try {
      // await createLoginToken(login);
      const url = new ZUrlBuilder().api().append('tokens').build();
      await Axios.post(url, login);
    } catch (err) {
      alerts.add(new ZAlertBuilder().error().message(get(err, 'response.data.message', err)).build());
    }

    const created = await tryGetProfile();
    logged.set(created);
    setWorking(false);
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
      const url = new ZUrlBuilder().api().append('profiles').append('recoveries').build();
      setWorking(true);
      // await createProfileRecovery(login);
      await Axios.post(url, login);
      alerts.add(new ZAlertBuilder().success().message('Check your email, and if it is registered, you will get a one time password you can use to login.').build());
    } catch (err) {
      alerts.add(new ZAlertBuilder().error().message(get(err, 'response.data.message', err)).build());
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
