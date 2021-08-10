import GitHubIcon from '@material-ui/icons/GitHub';
import HomeIcon from '@material-ui/icons/Home';
import MailIcon from '@material-ui/icons/Mail';
import { useLoginState, ZProfileButton, ZTopBar, ZTopBarItemBuilder } from '@zthun/works.react';
import { ZUrlBuilder } from '@zthun/works.url';
import React from 'react';
import { useHistory } from 'react-router-dom';

export const ZRoadblockApplicationName = 'Roadblock';
export const ZPortalUrl = new ZUrlBuilder().location().build();
export const ZDrawer = [
  new ZTopBarItemBuilder()
    .link(ZPortalUrl, 'Portal', '_self')
    .avatar(<HomeIcon />)
    .build(),
  new ZTopBarItemBuilder().separator().build(),
  new ZTopBarItemBuilder()
    .link('https://github.com/zthun/roadblock', 'GitHub')
    .avatar(<GitHubIcon />)
    .build(),
  new ZTopBarItemBuilder()
    .link('mailto:support@zthunworks.com', 'Contact')
    .avatar(<MailIcon />)
    .build()
];

/**
 * Renders the top menu.
 *
 * @returns The jsx that renders the top menu.
 */
export function ZRoadblockMenu(): JSX.Element {
  const hist = useHistory();
  const login = useLoginState();

  /**
   * Closes the more drawer if it is open and pushes the history location.
   *
   * @param loc The location to push.
   */
  function pushHistory(loc: string) {
    hist.push(loc);
  }

  const handleProfile = pushHistory.bind(null, '/profile');
  const handleLogin = pushHistory.bind(null, '/login');

  return (
    <ZTopBar route='/home' headerText={ZRoadblockApplicationName} moreItems={ZDrawer}>
      <ZProfileButton data-testid='ZRoadblockMenu-profile' profile={login.data} onProfile={handleProfile} onLogin={handleLogin} />
    </ZTopBar>
  );
}
