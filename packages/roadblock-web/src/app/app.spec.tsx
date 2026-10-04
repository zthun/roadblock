import {
  type IZCircusDriver,
  type IZCircusSetup,
  ZCircusBy,
} from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { describe, expect, it } from "vitest";

import { ZRoadblockApp } from "./app";
import { ZRoadblockAppComponentModel } from "./app.cm.mjs";

describe("ZRoadblockApp", () => {
  let _renderer: IZCircusSetup;
  let _driver: IZCircusDriver;

  const createTestTarget = async () => {
    const element = <ZRoadblockApp />;

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRoadblockAppComponentModel);
  };

  it("should run the application", () => {
    // Arrange.

    // Act.
    const target = createTestTarget();

    // Assert.
    expect(target).toBeTruthy();
  });
});
