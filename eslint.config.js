import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'public/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
  {
    // Skripte laufen in Node und dürfen auf die Konsole schreiben.
    files: ['scripts/**/*.{ts,mjs,js}', '*.config.{mjs,js,ts}', 'tests/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['**/*.astro'],
    rules: {
      // Astro-Komponenten deklarieren Props über Interfaces, die ESLint als ungenutzt sieht.
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
