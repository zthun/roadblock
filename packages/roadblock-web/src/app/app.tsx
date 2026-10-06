import {
  ZBannerMain,
  ZFashionThemeContext,
  ZImage,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import ZFashionThemeDark from "@zthun/fashion-theme-dark";
import { ZRoadblockEmailPasswordForm } from "@zthun/roadblock-react";

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
        <ZRoadblockEmailPasswordForm width={ZSizeFixed.Large} />
      </ZBannerMain>
    </ZFashionThemeContext>
  );
}
