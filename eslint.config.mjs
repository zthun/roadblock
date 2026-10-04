import { environments, react, recommended } from "@zthun/janitor-eslint-config";

export default [
  ...recommended,
  ...react,
  ...environments.node,
  ...environments.browser,
];
