import "reflect-metadata";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { AuthClient } from "better-auth/client";
import { createAuthClient } from "better-auth/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ZRoadblockAuthModule } from "./auth-module.mjs";
import type { IZRoadblockAuthServiceOptions } from "./auth-service.mjs";

describe("ZRoadblockAuthModule", () => {
  const _secret =
    "d6e374dfdf137a1efd92aa5475f7a6b09b80373088a2a1bc73c6bb1dd6b179a1";
  let _client: AuthClient<any>;
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

    _target = module.createNestApplication();
    await _target.init();

    return _target;
  };

  beforeEach(() => {
    _client = createAuthClient({ basePath: "http://localhost/api/auth" });
  });

  afterEach(async () => {
    await _target?.close();
  });

  it("should be able to create a new account by a sign up", async () => {
    // Arrange.
    const name = "Administrator";
    const email = "admin@zthunworks.com";
    const password = "some-really-lousy-password";
    await createTestTarget();

    // Act.
    const session = await _client.signUp.email({ name, email, password });

    // Assert.
    expect(session).toBeTruthy();
  });
});
