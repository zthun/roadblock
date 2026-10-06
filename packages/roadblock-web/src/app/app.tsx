import { ZBannerMain, ZFashionThemeContext } from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import ZFashionThemeDark from "@zthun/fashion-theme-dark";
import { ZRoadblockEmailPasswordForm } from "@zthun/roadblock-react";

export function ZRoadblockApp() {
  return (
    <ZFashionThemeContext value={ZFashionThemeDark}>
      <ZBannerMain>
        <ZRoadblockEmailPasswordForm width={ZSizeFixed.Large} />
      </ZBannerMain>
    </ZFashionThemeContext>
  );
}
