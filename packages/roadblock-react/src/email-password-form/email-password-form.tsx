import type { IZComponentWidth } from "@zthun/fashion-boutique";
import {
  useFashionTheme,
  ZButton,
  ZCard,
  ZIconFontAwesome,
  ZStack,
  ZTextInput,
} from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import { cssJoinDefined, ZOrientation } from "@zthun/helpful-fn";
import { useState } from "react";

export interface IZRoadblockEmailPasswordForm extends IZComponentWidth {}

export function ZRoadblockEmailPasswordForm({
  width,
}: IZRoadblockEmailPasswordForm) {
  const { primary } = useFashionTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const canLogin = !!email && !!password;

  return (
    <ZCard
      className={cssJoinDefined("ZRoadblockEmailPasswordForm-root")}
      width={width}
      TitleProps={{
        avatar: <ZIconFontAwesome name="lock" width={ZSizeFixed.Small} />,
        heading: "Login",
        subHeading: "Enter your credentials",
      }}
      footer={
        <ZStack
          orientation={ZOrientation.Horizontal}
          gap={ZSizeFixed.Medium}
          justify={{ content: "flex-end" }}
        >
          <ZButton fashion={primary} label="Login" disabled={!canLogin} />
        </ZStack>
      }
    >
      <ZStack gap={ZSizeFixed.Medium}>
        <ZTextInput
          label="Email"
          required
          value={email}
          onValueChange={setEmail}
        />

        <ZTextInput
          label="Password"
          required
          value={password}
          onValueChange={setPassword}
        />
      </ZStack>
    </ZCard>
  );
}
