import { ZWebAppLayout } from '@zthun/works.react';
import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router-dom';
import '../images/svg/zthunworks-owl.svg';
import { ZLoginPage } from './login/login-page';
import { ZProfilePage } from './profile/profile-page';

render(
  <ZWebAppLayout whoami='roadblock' home='profile' profileApp='roadblock'>
    <Route exact path='/login' component={ZLoginPage} />
    <Route exact path='/profile' component={ZProfilePage} />
  </ZWebAppLayout>,
  document.getElementById('zthunworks')
);
