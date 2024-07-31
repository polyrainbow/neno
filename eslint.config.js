import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import stylistic from "@stylistic/eslint-plugin";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactRecommended,
  {
    "plugins": {
      "@stylistic": stylistic,
      "@stylistic/ts": stylisticTs,
    },
    "settings": {
      "react": {
        "version": "18.2",
      },
    },
    "rules": {
      // eslint - https://eslint.org/docs/latest/rules/
      "eqeqeq": ["error"],
      "vars-on-top": ["error"],
      "no-eq-null": ["error"],
      "no-label-var": ["error"],
      "camelcase": ["error"],
      "no-multi-assign": ["error"],
      "no-var": ["error"],
      "prefer-const": ["error"],
      "no-console": ["error"],
      "no-constant-condition": [0],
      "object-curly-spacing": [2, "always"],
      "indent": [
        "error",
        2,
      ],

      // react
      "react/jsx-pascal-case": "error",
      "react/jsx-uses-vars": ["error"],
      "react/react-in-jsx-scope": [0],

      // react-hooks - temporarily disabled
      // "react-hooks/rules-of-hooks": "error",

      // @typescript-eslint
      "@typescript-eslint/ban-ts-comment": [0],
      "@typescript-eslint/no-use-before-define": ["error"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
        },
      ],

      // @stylistic - https://eslint.style/packages/default#rules
      "@stylistic/linebreak-style": [
        "error",
        "unix",
      ],
      "@stylistic/no-mixed-spaces-and-tabs": ["error"],
      "@stylistic/operator-linebreak": ["error", "before"],
      "@stylistic/max-len": ["error", { "code": 80 }],
      "@stylistic/no-trailing-spaces": ["error"],
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/type-annotation-spacing": "error",

      // @stylistic/ts - https://eslint.style/packages/ts#rules
      "@stylistic/ts/comma-dangle": ["error", "always-multiline"],
      "@stylistic/ts/semi": ["error", "always"],
      "@stylistic/ts/space-before-blocks": ["error", "always"],
      "@stylistic/ts/quotes": [
        "error",
        "double",
      ],
      "@stylistic/ts/key-spacing": ["error", { "beforeColon": false }],
      "@stylistic/ts/keyword-spacing": ["error"],
    },
  },
];
