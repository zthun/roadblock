import "reflect-metadata";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { createAuthClient } from "better-auth/client";
import { afterEach, describe, expect, it } from "vitest";

import { ZRoadblockAuthModule } from "./auth-module.mjs";
import type { IZRoadblockAuthServiceOptions } from "./auth-service.mjs";

describe("ZRoadblockAuthModule", () => {
  const name = "Administrator";
  const email = "admin@zthunworks.com";
  const password = "bad-pa$$w0rd";

  const _secret =
    "d6e374dfdf137a1efd92aa5475f7a6b09b80373088a2a1bc73c6bb1dd6b179a1";

  let _client: ReturnType<typeof createAuthClient>;
  let _target: INestApplication | undefined;

  const createTestTarget = async (
    options: Partial<IZRoadblockAuthServiceOptions> = { secret: _secret },
  ) => {
    const { secret = _secret, ...rest } = options;

    const module = await Test.createTestingModule({
      imports: [
        ZRoadblockAuthModule.forRoot({
          secret,
          ...rest,
        }),
      ],
    }).compile();

    _target = module.createNestApplication({ bodyParser: false });
    await _target.listen(0, "127.0.0.1");

    const baseURL = await _target.getUrl();
    _client = createAuthClient({ baseURL });

    return _target;
  };

  afterEach(async () => {
    await _target?.close();
    _target = undefined;
  });

  describe("Email/Password", () => {
    describe("SignUp", () => {
      it("should be able to create a new account by a sign up", async () => {
        // Arrange.
        await createTestTarget();

        // Act.
        const { data } = await _client.signUp.email({ name, email, password });

        // Assert.
        expect(data?.user).toMatchObject({ name, email });
      });
    });

    describe("SignIn", () => {
      it("should be able to login to a newly created account", async () => {
        // Arrange.
        await createTestTarget();
        await _client.signUp.email({ name, email, password });

        // Act.
        const { data } = await _client.signIn.email({ email, password });

        // Assert.
        expect(data?.user).toMatchObject({ name, email });
      });
    });
  });
});
