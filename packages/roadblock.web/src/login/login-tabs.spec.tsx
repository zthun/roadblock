import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ZLoginTab, ZLoginTabs } from './login-tabs';

describe('ZLoginTabs', () => {
  it('renders the default form.', () => {
    // Arrange
    const target = render(<ZLoginTabs />);
    // Act
    const actual = target.queryByTestId('ZLoginTabs-root');
    // Assert
    expect(actual).toBeTruthy();
  });

  describe('Options', () => {
    it('shows the login tab if hideLoginTab is false.', () => {
      // Arrange
      const target = render(<ZLoginTabs initialTab={ZLoginTab.Create} hideLoginTab={false} />);
      // Act
      const actual = target.queryByTestId('ZLoginTabs-tab-login');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('hides the login tab if hideLoginTab is true.', () => {
      // Arrange
      const target = render(<ZLoginTabs initialTab={ZLoginTab.Create} hideLoginTab={true} />);
      // Act
      const actual = target.queryByTestId('ZLoginTabs-tab-login');
      // Assert
      expect(actual).toBeFalsy();
    });

    it('shows the create tab if hideCreateTab is false.', () => {
      const target = render(<ZLoginTabs hideCreateTab={true} />);
      // Act
      const actual = target.queryByTestId('ZLoginTabs-tab-create');
      // Assert
      expect(actual).toBeFalsy();
    });

    it('hides the create tab if hideCreateTab is true.', () => {
      const target = render(<ZLoginTabs hideCreateTab={true} />);
      // Act
      const actual = target.queryByTestId('ZLoginTabs-tab-create');
      // Assert
      expect(actual).toBeFalsy();
    });

    it('shows the recover tab if hideRecoverTab is false.', () => {
      const target = render(<ZLoginTabs hideRecoverTab={true} />);
      // Act
      const actual = target.queryByTestId('ZLoginTabs-tab-recover');
      // Assert
      expect(actual).toBeFalsy();
    });

    it('hides the recover tab if hideRecoverTab is true.', () => {
      const target = render(<ZLoginTabs hideRecoverTab={true} />);
      // Act
      const actual = target.queryByTestId('ZLoginTabs-tab-recover');
      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('Tabs', () => {
    it('initializes to the login tab.', () => {
      // Arrange
      const target = render(<ZLoginTabs initialTab={ZLoginTab.Login} />);
      // Act
      const actual = target.queryByTestId('ZLoginTabs-form-login');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('initializes to the create tab.', () => {
      // Arrange
      const target = render(<ZLoginTabs initialTab={ZLoginTab.Create} />);
      // Act
      const actual = target.queryByTestId('ZLoginTabs-form-create');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('initializes to the recover tab.', () => {
      // Arrange
      const target = render(<ZLoginTabs initialTab={ZLoginTab.Recover} />);
      // Act
      const actual = target.queryByTestId('ZLoginTabs-form-recover');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('switches to the recover tab.', () => {
      // Arrange
      const target = render(<ZLoginTabs initialTab={ZLoginTab.Login} />);
      // Act
      const tab = target.queryByTestId('ZLoginTabs-tab-recover');
      fireEvent.click(tab);
      const actual = target.queryByTestId('ZLoginTabs-form-recover');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('switches to the create tab.', () => {
      // Arrange
      const target = render(<ZLoginTabs initialTab={ZLoginTab.Recover} />);
      // Act
      const tab = target.queryByTestId('ZLoginTabs-tab-create');
      fireEvent.click(tab);
      const actual = target.queryByTestId('ZLoginTabs-form-create');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('switches to the login tab.', () => {
      // Arrange
      const target = render(<ZLoginTabs initialTab={ZLoginTab.Create} />);
      // Act
      const tab = target.queryByTestId('ZLoginTabs-tab-login');
      fireEvent.click(tab);
      const actual = target.queryByTestId('ZLoginTabs-form-login');
      // Assert
      expect(actual).toBeTruthy();
    });
  });
});
