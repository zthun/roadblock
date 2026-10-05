import { environments, react, recommended } from "@zthun/janitor-eslint-config";

export default [
  ...recommended,
  ...react,
  {
    rules: {
      "@eslint-react/no-unnecessary-use-prefix": "off",
    },
  },
  ...environments.node,
  ...environments.browser,
];
