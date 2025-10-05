module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname
  },
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error'
  }
};
