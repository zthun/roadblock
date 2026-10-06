import { type IZIdentity, ZIdentityBuilder } from "@zthun/roadblock-domain";
import { createAuthClient } from "better-auth/client";
import { createContext, use } from "react";

// export interface IZAuthenticateEmailOtp {}
// export interface IZAuthenticatePasskey {}

export interface IZAuthenticationEmailPassword {
  email: string;
  password: string;
}

export type IZAuthentication = IZAuthenticationEmailPassword;

export interface IZAuthenticationService {
  authenticate(strategy: IZAuthentication): Promise<IZIdentity>;
}

export class ZAuthenticationServiceBetter implements IZAuthenticationService {
  public static create(): ReturnType<typeof createAuthClient> {
    return createAuthClient({ basePath: "/api/auth" });
  }

  public constructor(private _client: ReturnType<typeof createAuthClient>) {}

  public async authenticate({
    email,
    password,
  }: IZAuthentication): Promise<IZIdentity> {
    const { data, error } = await this._client.signIn.email({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message ?? "Authentication failed.");
    }

    if (!data?.user) {
      throw new Error("Authentication did not return a user.");
    }

    return new ZIdentityBuilder()
      .id(data.user.id)
      .email(data.user.email)
      .build();
  }
}

export function createDefaultAuthenticationService() {
  const auth = ZAuthenticationServiceBetter.create();
  return new ZAuthenticationServiceBetter(auth);
}

export const ZAuthenticationServiceContext = createContext(
  createDefaultAuthenticationService(),
);

export const useAuthService = () => use(ZAuthenticationServiceContext);
