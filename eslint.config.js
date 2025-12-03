import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import simpleSort from 'eslint-plugin-simple-import-sort';

export default [
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ignores: ['node_modules', 'dist', 'build', 'snapshots'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleSort,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['./*', '../*'], // blocks both ./ and ../ relative imports
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^@/'], // @/... imports first
            ['^[a-z]'], // external packages
            ['^\\u0000'], // side effect imports
            ['^\\.'], // relative imports last
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
];
