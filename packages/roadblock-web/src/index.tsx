import { ZRouter } from "@zthun/fashion-boutique";
import React from "react";
import { createRoot } from "react-dom/client";

import { ZRoadblockApp } from "./app/app";

const container = createRoot(document.getElementById("zthunworks-roadblock")!);

container.render(
  <React.StrictMode>
    <ZRouter>
      <ZRoadblockApp />
    </ZRouter>
  </React.StrictMode>,
);
