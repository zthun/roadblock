import { Grid, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { IZProfile, IZProfileActivation, ZProfileActivationBuilder } from '@zthun/works.core';
import { ZAlertBuilder } from '@zthun/works.message';
import { useAlertService, useErrorHandler, useProfileAndWatch, useProfileService, ZCircularProgress, ZPaperCard, ZProfileActivationForm, ZProfileForm } from '@zthun/works.react';
import { get } from 'lodash';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

/**
 * Renders the profile page.
 *
 * @returns The jsx that renders the profile page.
 */
export function ZProfilePage() {
  const profile = useProfileAndWatch();
  const alerts = useAlertService();
  const errors = useErrorHandler();
  const profileSvc = useProfileService();
  const [loggingOut, setLoggingOut] = useState(false);
  const [activating, setActivating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activation, setActivation] = useState(new ZProfileActivationBuilder().email(get(profile.data, 'email', null)).build());
  const waiting = deleting || deactivating || updatingProfile || activating || reactivating || loggingOut;

  /**
   * Occurs when the user clicks the logout button.
   */
  async function handleLogout() {
    try {
      setLoggingOut(true);
      await profileSvc.logout();
      alerts.create(new ZAlertBuilder().success().message('Logout successful.').build());
      setLoggingOut(false);
      profile.set(null);
    } catch (err) {
      errors.handle(err);
      setLoggingOut(false);
    }
  }

  /**
   * Attempts to activate the profile.
   *
   * @param value The request body to activate with.
   *
   * @returns A promise that resolves once the request is complete.
   */
  async function handleActivation(value: IZProfileActivation) {
    try {
      setActivation(value);
      setActivating(true);
      const update = await profileSvc.activate(value);
      alerts.create(new ZAlertBuilder().success().message('Account activated.').build());
      setActivating(false);
      profile.set(update);
    } catch (err) {
      errors.handle(err);
      setActivating(false);
    }
  }

  /**
   * Attempts to reactivate the profile by sending the activation code again.
   *
   * @param value The request body to activate with.
   *
   * @returns A promise that resolves once the request is complete.
   */
  async function handleReactivation() {
    try {
      setReactivating(true);
      const body = new ZProfileActivationBuilder().email(profile.data.email).build();
      setActivation(body);
      const update = await profileSvc.reactivate(body);
      alerts.create(new ZAlertBuilder().success().message('Activation code sent. Please check your email.').build());
      setReactivating(false);
      profile.set(update);
    } catch (err) {
      errors.handle(err);
      setReactivating(false);
    }
  }

  /**
   * Attempts to deactivate a profile.
   */
  async function handleDeactivation() {
    try {
      setDeactivating(true);
      const body = new ZProfileActivationBuilder().email(profile.data.email).build();
      setActivation(body);
      const update = await profileSvc.deactivate();
      alerts.create(new ZAlertBuilder().success().message('Account deactivated. Send yourself another activation code to reactivate.').build());
      profile.set(update);
    } catch (err) {
      errors.handle(err);
      setDeactivating(false);
    }

    setDeactivating(false);
  }

  /**
   * Attempts to delete a profile.
   */
  async function handleDelete() {
    try {
      setDeleting(true);
      setActivation(null);
      await profileSvc.delete();
      alerts.create(new ZAlertBuilder().success().message('Account deleted').build());
      setDeleting(false);
      profile.set(null);
    } catch (err) {
      errors.handle(err);
      setDeleting(false);
    }
  }

  /**
   * Attempts to update a profile.
   *
   * @param changes The changes to make to the current profile.
   */
  async function handleUpdateProfile(changes: IZProfile) {
    try {
      setUpdatingProfile(true);
      setActivation(new ZProfileActivationBuilder().email(profile.data.email).build());
      const updated = await profileSvc.update(changes);
      alerts.create(new ZAlertBuilder().success().message('Account updated').build());
      setUpdatingProfile(false);
      profile.set(updated);
    } catch (err) {
      errors.handle(err);
      setUpdatingProfile(false);
    }
  }

  /**
   * Creates the jsx for the profile loading indicator.
   *
   * @returns The jsx that renders the profile loading progress.
   */
  function createProfileLoading() {
    return (
      <Grid item>
        <ZCircularProgress className='ZProfilePage-progress-profile-loading' data-testid='ZProfilePage-progress-profile-loading' size='5em' />
      </Grid>
    );
  }

  /**
   * Creates the form card that can be used to update the core profile information.
   *
   * @returns The jsx that renders the core profile form.
   */
  function createProfileForm() {
    return <ZProfileForm disabled={waiting} loading={updatingProfile} profile={profile.data} onProfileChange={handleUpdateProfile} />;
  }

  /**
   * Creates the form card that allows the user to deactivate their account.
   *
   * @returns The jsx that lets the user deactivate their account.
   */
  function createProfileDeactivateForm() {
    return (
      <ZPaperCard
        headerText='Deactivate Account'
        subHeaderText='Turn off account access'
        avatar={<PauseCircleOutlineIcon fontSize='large' />}
        loading={deactivating}
        disabled={waiting}
        size='md'
        actionText='Deactivate'
        actionColor='secondary'
        onAction={handleDeactivation}
      >
        <Typography variant='body1' component='p'>
          This will deactivate your account. If you wish to reactivate your account, you will need to send yourself another activation key.{' '}
        </Typography>
      </ZPaperCard>
    );
  }

  /**
   * Creates the form card that allows the user to delete their account.
   *
   * @returns The jsx that lets the user delete their account.
   */
  function createProfileDeleteForm() {
    return (
      <ZPaperCard
        headerText='Delete Account'
        subHeaderText='Remove your account'
        avatar={<DeleteOutlineIcon fontSize='large' />}
        loading={deleting}
        disabled={waiting}
        size='md'
        confirmation='I understand that this action is not reversible.'
        actionText='Delete'
        actionColor='secondary'
        onAction={handleDelete}
      >
        <Typography variant='body1' component='p'>
          This will completely delete your account and all preferences associated with it.
        </Typography>
      </ZPaperCard>
    );
  }

  /**
   * Creates the form card that the user can use to activate their account.
   *
   * @returns The jsx that renders the activation form card.
   */
  function createProfileActivationForm() {
    return <ZProfileActivationForm activation={activation} onActivationChange={handleActivation} disabled={waiting} loading={activating} />;
  }

  /**
   * Creates the form card that the user can use to get another activation code.
   *
   * @returns The jsx that renders the reactivation form.
   */
  function createProfileReactivationForm() {
    return (
      <ZPaperCard
        avatar={<MailOutlineIcon fontSize='large' />}
        headerText='Resend Activation Code'
        subHeaderText='Get another code'
        actionText='Send'
        onAction={handleReactivation}
        actionColor='secondary'
        size='md'
        disabled={waiting}
        loading={reactivating}
      >
        <Typography variant='body1' component='p'>
          If you disabled your account, lost your activation key, or your activation key has expired, you can request a new one here.
        </Typography>
      </ZPaperCard>
    );
  }

  /**
   * Creates the form that allows the user to log out of their session.
   *
   * @returns The jsx that allows the user to log out of their session.
   */
  function createProfileLogoutForm() {
    return (
      <ZPaperCard avatar={<ExitToAppIcon fontSize='large' />} headerText='End Session' subHeaderText='End current session on this device' actionText='Logout' onAction={handleLogout} actionColor='secondary' size='md' disabled={waiting} loading={loggingOut}>
        <Typography variant='body1' component='p'>
          This will end your current session and log you out. If you are logged in on other devices, then you will need to click this button on those devices there too.
        </Typography>
      </ZPaperCard>
    );
  }

  /**
   * Creates the jsx for the activation form.
   *
   * @returns The jsx that renders the activation form.
   */
  function createProfileActivatedSession() {
    return (
      <React.Fragment>
        <Grid item>{createProfileForm()}</Grid>
        <Grid item>
          <Grid container spacing={3} direction='column'>
            <Grid item>{createProfileLogoutForm()}</Grid>
            <Grid item>{createProfileDeactivateForm()}</Grid>
            <Grid item>{createProfileDeleteForm()}</Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  /**
   * Creates the jsx for the deactivation form.
   *
   * @returns The jsx that renders the deactivation form.
   */
  function createProfileDeactivatedSession() {
    return (
      <React.Fragment>
        <Grid item>{createProfileForm()}</Grid>
        <Grid item>
          <Grid container spacing={3} direction='column'>
            <Grid item>{createProfileLogoutForm()}</Grid>
            <Grid item>{createProfileActivationForm()}</Grid>
            <Grid item>{createProfileReactivationForm()}</Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  /**
   * Creates the profile session form.
   *
   * @returns The jsx that represents the current profile state.
   */
  function createProfileFromSession() {
    return profile.data.active ? createProfileActivatedSession() : createProfileDeactivatedSession();
  }

  /**
   * Creates a redirection jsx that redirects to the login page.
   *
   * @returns The jsx that redirects to the login page.
   */
  function createProfileRedirect() {
    return <Redirect to='/login' />;
  }

  /**
   * Creates the root form profile based on the login state.
   *
   * @returns The jsx associated with the login state.
   */
  function createContentFromProfile() {
    if (profile.data) {
      return createProfileFromSession();
    }

    if (profile.data === null) {
      return createProfileRedirect();
    }

    return createProfileLoading();
  }

  return (
    <Grid container className='ZProfilePage-root' data-testid='ZProfilePage-root' spacing={3} justifyContent='center'>
      {createContentFromProfile()}
    </Grid>
  );
}
