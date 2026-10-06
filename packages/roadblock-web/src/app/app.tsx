import {
  ZBannerMain,
  ZFashionThemeContext,
  ZImage,
  ZNavigate,
  ZRoute,
  ZRouteMap,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import ZFashionThemeDark from "@zthun/fashion-theme-dark";

import { ZRoadblockLoginPage } from "../login/login-page";

export function ZRoadblockApp() {
  return (
    <ZFashionThemeContext value={ZFashionThemeDark}>
      <ZBannerMain
        TitleProps={{
          avatar: (
            <ZImage
              src="./roadblock/roadblock_256x256.png"
              height={ZSizeFixed.Medium}
              fit="scale-down"
            />
          ),
          heading: "Zthunworks Roadblock",
          subHeading: "Who are you?",
        }}
      >
        <ZRouteMap>
          <ZRoute path="/login" element={<ZRoadblockLoginPage />} />
          <ZRoute path="" element={<ZNavigate to="/login" />} />
        </ZRouteMap>
      </ZBannerMain>
    </ZFashionThemeContext>
  );
}
