import { ZCircusBy, ZCircusComponentModel } from '@zthun/cirque';
import { ZButtonComponentModel } from '@zthun/fashion-boutique';

export type ZIdentityButtonState = 'authenticated' | 'unauthenticated' | 'loading';

/**
 * Represents a component model for the identity button.
 */
export class ZIdentityButtonComponentModel extends ZCircusComponentModel {
  public static readonly Selector = '.ZIdentityButton-root';

  /**
   * Gets the underlying button component.
   *
   * @returns
   *        The component model for the button.
   */
  public button(): Promise<ZButtonComponentModel> {
    return ZCircusBy.first(this.driver, ZButtonComponentModel);
  }

  /**
   * Gets whether the button is currently in the authenticated state.
   *
   * @returns
   *        True if the button is representing an authenticated state.
   */
  public async authenticated(): Promise<boolean> {
    const authenticated = await this.driver.attribute('data-authenticated');
    return authenticated === 'true';
  }
}
