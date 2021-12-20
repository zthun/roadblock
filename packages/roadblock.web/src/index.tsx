import { ZTopNavAvatar, ZWebAppLayout } from '@zthun/works.react';
import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router-dom';
import '../images/svg/zthunworks-owl.svg';
import { ZLoginPage } from './login/login-page';
import { ZProfilePage } from './profile/profile-page';

const ZAvatarOwl = <ZTopNavAvatar src='images/svg/zthunworks-owl.svg' />;

render(
  <ZWebAppLayout headerText='Zthunworks' whoami='roadblock' home='profile' profileApp='roadblock' avatar={ZAvatarOwl}>
    <Route exact path='/login' component={ZLoginPage} />
    <Route exact path='/profile' component={ZProfilePage} />
  </ZWebAppLayout>,
  document.getElementById('zthunworks')
);
