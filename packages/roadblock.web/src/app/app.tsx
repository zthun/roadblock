import { Snackbar } from '@material-ui/core';
import { tryGetProfile, useLogin, ZAlertStackList, ZStatusCodePage } from '@zthun/works.react';
import React, { useEffect } from 'react';
import { HashRouter, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ZRoadblockLoginPage } from '../login/login-page';
import { ZRoadblockMenu } from '../menu/menu';
import { ZRoadblockProfilePage } from '../profile/profile-page';

/**
 * Renders the jsx for the status code page.
 *
 * @param props The render props.
 *
 * @returns The jsx for the status code page.
 */
export function renderStatusCodePage(props: RouteComponentProps<{ code: string }>) {
  return <ZStatusCodePage code={props.match.params.code} />;
}

/**
 * Represents the entry point of the client application.
 *
 * @returns The jsx that renders the entire application.
 */
export function ZRoadblockApp() {
  const login = useLogin();

  useEffect(() => {
    login.set();
    tryGetProfile().then((profile) => login.set(profile));
  });

  return (
    <div className='ZRoadblockApp-root' data-testid='ZRoadblockApp-root'>
      <HashRouter>
        <ZRoadblockMenu />
        <article className='ZRoadblockApp-article' data-testid='ZRoadblockApp-article'>
          <Switch>
            <Route exact path='/login' component={ZRoadblockLoginPage} />
            <Route exact path='/profile' component={ZRoadblockProfilePage} />
            <Route exact path='/status-code/:code' render={renderStatusCodePage} />
            <Redirect exact from='/' to='/login' />
            <Redirect to='/status-code/404' />
          </Switch>
        </article>
      </HashRouter>
      <Snackbar className='ZRoadblockApp-snackbar' open={true} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <ZAlertStackList />
      </Snackbar>
    </div>
  );
}
