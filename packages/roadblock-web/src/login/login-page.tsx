import { ZStack } from "@zthun/fashion-boutique";
import { ZSizeFixed, ZSizeVaried } from "@zthun/fashion-tailor";
import { ZOrientation } from "@zthun/helpful-fn";
import { ZRoadblockEmailPasswordForm } from "@zthun/roadblock-react";

export function ZRoadblockLoginPage() {
  return (
    <ZStack
      width={ZSizeVaried.Full}
      orientation={ZOrientation.Horizontal}
      justify={{ content: "center" }}
    >
      <ZRoadblockEmailPasswordForm width={ZSizeFixed.Large} />
    </ZStack>
  );
}
