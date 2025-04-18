const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const path = require('path');

// Define environment-aware rules
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = [
  // Apply prettier config
  prettierConfig,

  {
    // Apply TypeScript parser for TypeScript files
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        NodeJS: true,
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
      'prettier': prettierPlugin,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
      '@typescript-eslint/naming-convention': [
        'error',
        // Enforce camelCase for methods/properties
        {
          'selector': 'memberLike',
          'format': ['camelCase']
        },
        // Allow PascalCase for classes/interfaces
        {
          'selector': 'typeLike',
          'format': ['PascalCase']
        }
      ],

      // Import organization
      'import/order': [
        'error',
        {
          'groups': [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index']
          ],
          'newlines-between': 'always',
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true
          }
        }
      ],

      // General code quality
      'max-len': ['warn', {
        'code': 100,
        'ignoreComments': true,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true
      }],
      'no-console': isDevelopment ? 'warn' : 'error',
      'no-debugger': isDevelopment ? 'warn' : 'error',

      // Error handling
      'no-throw-literal': 'error',

      // GraphQL & NestJS specific conventions
      'indent': ['error', 2],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'semi': ['error', 'always'],

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },

  // Configuration for non-TypeScript files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // Ignore patterns
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '.eslintrc.js'],
  },
];