import {
  type IZCircusDriver,
  type IZCircusSetup,
  ZCircusBy,
} from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { ZTestRouter } from "@zthun/fashion-boutique";
import type { MemoryHistory } from "history";
import { createMemoryHistory } from "history";
import { beforeEach, describe, expect, it } from "vitest";

import { ZRoadblockApp } from "./app";
import { ZRoadblockAppComponentModel } from "./app.cm.mjs";

describe("ZRoadblockApp", () => {
  let _renderer: IZCircusSetup;
  let _driver: IZCircusDriver;
  let _history: MemoryHistory;

  beforeEach(() => {
    _history = createMemoryHistory();
  });

  const createTestTarget = async () => {
    const element = (
      <ZTestRouter location={_history.location} navigator={_history}>
        <ZRoadblockApp />
      </ZTestRouter>
    );

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
