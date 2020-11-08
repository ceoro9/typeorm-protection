module.exports =  {
  parser:  '@typescript-eslint/parser',
  extends:  [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    "node_modules/",
    "build/",
    "package.json",
    "package-lock.json",
    ".eslintrc.js",
    "tsconfig.json",
    "ormconfig.json",
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module',
  },
  rules:  {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
