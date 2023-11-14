import { Alert, AlertTitle, Collapse, Dialog, TextField, Typography } from '@mui/material';
import { IZProfile, ZProfileBuilder } from '@zthun/works.core';
import { IZComponentDisabled, IZComponentHeader, IZComponentLoading, makeStyles, selectAvatar, ZPaperCard } from '@zthun/works.react';
import { get, noop } from 'lodash';
import React, { FormEvent, useState } from 'react';
import { ZProfileAvatarForm } from './profile-avatar-form';

export interface IZProfileFormProps extends Partial<IZComponentHeader>, IZComponentLoading, IZComponentDisabled {
  hideAccountInformation?: boolean;
  hidePassword?: boolean;

  saveText?: string;
  accountInformationHeaderText?: string;
  passwordHeaderText?: string;

  profile: IZProfile;
  onProfileChange?: (profile: IZProfile) => void;
}

const useProfileFormStyles = makeStyles()((theme) => ({
  root: {
    maxWidth: theme.sizing.card.md
  },

  avatar: {
    'height': theme.sizing.avatar.md,
    'width': theme.sizing.avatar.md,
    'borderRadius': theme.rounding.circle,
    'background': theme.palette.common.white,
    'border': `${theme.sizing.thickness.xs} solid ${theme.palette.grey[400]}`,

    '&:hover': {
      cursor: 'pointer',
      boxShadow: `0 0 ${theme.sizing.font.xl} ${theme.sizing.thickness.sm} ${theme.palette.primary.main}`
    }
  },

  field: {
    marginBottom: theme.sizing.gaps.md
  }
}));

/**
 * Creates a form for modifying the users profile.
 *
 * @param props The properties for the form.
 *
 * @returns The jsx rendering of the profile form.
 */
export function ZProfileForm(props: IZProfileFormProps): JSX.Element {
  const [email, setEmail] = useState<string>(get(props, 'profile.email', ''));
  const [display, setDisplay] = useState<string>(get(props, 'profile.display', ''));
  const [password, setPassword] = useState<string>(get(props, 'profile.password', ''));
  const [confirm, setConfirm] = useState<string>(get(props, 'profile.confirm', ''));
  const [avatar, setAvatar] = useState<string>(get(props, 'profile.avatar'));
  const [editAvatar, setEditAvatar] = useState(false);
  const styles = useProfileFormStyles();
  const avatarToShow = selectAvatar(avatar, email);

  const {
    hideAccountInformation = false,
    hidePassword = false,

    headerText = 'Profile',
    subHeaderText = 'Update your information',
    saveText = 'Update Profile',
    accountInformationHeaderText = 'Account Information',
    passwordHeaderText = 'Update Password',

    loading = false,
    disabled = false,

    profile,
    onProfileChange = noop
  } = props;

  /**
   * Builds a profile given the current state of the form.
   *
   * @returns A profile that can be used to update the existing profile with new information.
   */
  function build() {
    const currentEmail = get(profile, 'email', '');

    let updated = new ZProfileBuilder().display(display || null).avatar(avatar);
    updated = email && email.toLowerCase() !== currentEmail.toLowerCase() ? updated.email(email) : updated;
    updated = password || confirm ? updated.password(password).confirm(confirm) : updated;
    return updated;
  }

  /**
   * Occurs when the user clicks on the avatar to edit it.
   */
  function handleEditAvatar() {
    setEditAvatar(true);
  }

  /**
   * Occurs when the user decides to close the avatar editor.
   */
  function handleCloseEditAvatar() {
    setEditAvatar(false);
  }

  /**
   * Occurs when the user edits a custom avatar and clicks the update button.
   *
   * This will actually have the same effect as if the user clicked the save button, as the
   * onProfileChange will be invoked in the properties.
   *
   * @param url The url of the avatar.
   */
  function handleUpdateAvatar(url: string) {
    const profile = build().avatar(url);
    setAvatar(url);
    setPassword('');
    setConfirm('');
    handleCloseEditAvatar();
    onProfileChange(profile.build());
  }

  /**
   * Occurs when the user enters in changes to the email.
   *
   * @param event The event that targets the input that changed.
   */
  function handleEmailChange(event: any) {
    setEmail(event.target.value);
  }

  /**
   * Occurs when the user enters in their display name.
   *
   * @param event The event that targets the input that changed.
   */
  function handleDisplayChange(event: any) {
    setDisplay(event.target.value);
  }

  /**
   * Occurs when the user enters in a new password.
   *
   * @param event The event that targets the input that changed.
   */
  function handlePasswordChange(event: any) {
    setPassword(event.target.value);
  }

  /**
   * Occurs when the user enters in the new password confirmation.
   *
   * @param event The event that targets the input that changed.
   */
  function handleConfirmChange(event: any) {
    setConfirm(event.target.value);
  }

  /**
   * Occurs when the user clicks the Update Profile button.
   *
   * This raises the onProfileChange event in the properties.
   *
   * @param e The form event.
   */
  function handleSave(e: FormEvent) {
    e.preventDefault();
    const profile = build();
    setPassword('');
    setConfirm('');
    onProfileChange(profile.build());
  }

  /**
   * Creates the avatar dialog for when the user wants to edit their avatar.
   *
   * @returns The jsx for the avatar dialog.
   */
  function createAvatarDialog() {
    return (
      <Dialog className='ZProfileForm-avatar-dialog' data-testid='ZProfileForm-avatar-dialog' open={editAvatar} onClose={handleCloseEditAvatar}>
        <ZProfileAvatarForm avatar={avatarToShow} onAvatarChange={handleUpdateAvatar} />
      </Dialog>
    );
  }

  /**
   * Creates a text field.
   *
   * @param name The name of the field.
   * @param label The field label.
   * @param type The type of field.
   * @param val The initial value.
   * @param handleInput The callback for when the field changes.
   *
   * @returns The jsx for the text field.
   */
  function createTextField(name: string, label: string, type: string, val: string, handleInput: (e: any) => void) {
    const id = `ZProfileForm-input-${name}`;
    const className = `ZProfileForm-input ${id}`;
    return (
      <div className={styles.classes.field}>
        <TextField className={className} data-testid={id} fullWidth={true} label={label} type={type} margin='none' variant='outlined' value={val} disabled={disabled} onInput={handleInput} />
      </div>
    );
  }

  /**
   * Creates the jsx for the account information section.
   *
   * @returns The jsx for the account information section.
   */
  function createAccountInformation() {
    if (hideAccountInformation) {
      return null;
    }

    const displayTextField = createTextField('display', 'Display', 'text', display, handleDisplayChange);
    const emailTextField = createTextField('email', 'Email', 'email', email, handleEmailChange);
    const emailOriginal = get(profile, 'email', '');
    const emailDirty = emailOriginal.toLowerCase() !== email.toLowerCase();

    const emailWarning = (
      <Collapse in={emailDirty}>
        <Alert severity='warning' className='ZProfileForm-alert-email-dirty' data-testid={`ZProfileForm-alert-email-dirty-${emailDirty}`}>
          <AlertTitle>
            <Typography variant='subtitle1'>Email Changed</Typography>
          </AlertTitle>
          <Typography variant='caption'>{`If you update your profile, it will be deactivated to confirm your new email.  Your original email was ${emailOriginal}`}</Typography>
        </Alert>
      </Collapse>
    );

    return (
      <React.Fragment>
        <h4>{accountInformationHeaderText}</h4>
        {displayTextField}
        {emailTextField}
        {emailWarning}
      </React.Fragment>
    );
  }

  /**
   * Creates the jsx for the update password section.
   *
   * @returns The jsx for the update password section.
   */
  function createUpdatePassword() {
    if (hidePassword) {
      return null;
    }

    const passwordTextField = createTextField('password', 'New Password', 'password', password, handlePasswordChange);
    const confirmTextField = createTextField('confirm', 'Confirm Password', 'password', confirm, handleConfirmChange);

    return (
      <React.Fragment>
        <h4>{passwordHeaderText}</h4>
        {passwordTextField}
        {confirmTextField}
      </React.Fragment>
    );
  }

  /**
   * Creates the image jsx for the avatar.
   *
   * @returns The jsx for the avatar image.
   */
  function createAvatarImage() {
    return <img className={`ZProfileForm-avatar ${styles.classes.avatar}`} data-testid='ZProfileForm-avatar' src={avatarToShow} onClick={handleEditAvatar} />;
  }

  const avatarDialog = createAvatarDialog();
  const accountInformation = createAccountInformation();
  const updatePassword = createUpdatePassword();
  const formIcon = createAvatarImage();

  return (
    <React.Fragment>
      {avatarDialog}
      <form className={`ZProfileForm-root ${styles.classes.root}`} data-testid='ZProfileForm-root' noValidate={true} onSubmit={handleSave}>
        <ZPaperCard avatar={formIcon} headerText={headerText} subHeaderText={subHeaderText} loading={loading} disabled={disabled} actionText={saveText} actionType='submit'>
          {accountInformation}
          {updatePassword}
        </ZPaperCard>
      </form>
    </React.Fragment>
  );
}
