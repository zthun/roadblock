import "../images/svg/zthunworks-owl.svg";

import { ZWebAppLayout } from "@zthun/works.react";
import React from "react";
import { createRoot } from "react-dom/client";
import { Route } from "react-router-dom";

import { ZLoginPage } from "./login/login-page";
import { ZProfilePage } from "./profile/profile-page";

createRoot(document.getElementById("roadblock.zthunworks")).render(
  <ZWebAppLayout whoami="roadblock" home="profile" profileApp="roadblock">
    <Route exact path="/login" component={ZLoginPage} />
    <Route exact path="/profile" component={ZProfilePage} />
  </ZWebAppLayout>,
);
