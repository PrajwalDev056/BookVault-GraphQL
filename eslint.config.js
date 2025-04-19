const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const path = require('path');

// Define environment-aware rules
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = [
    // Place prettier config first to be overridden by more specific rules
    prettierConfig,

    {
        // Apply TypeScript parser for TypeScript files
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                createDefaultProgram: true,
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
            import: importPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'memberLike',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
                {
                    selector: 'property',
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
            ],
            'import/order': [
                'warn',
                {
                    groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'max-len': [
                'warn',
                {
                    code: 100,
                    ignoreComments: true,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ],
            'no-console': isDevelopment ? 'warn' : 'error',
            'no-debugger': isDevelopment ? 'warn' : 'error',
            'no-throw-literal': 'warn',
            indent: 'off',
            '@typescript-eslint/indent': 'off',
            'prettier/prettier': [
                'warn',
                {
                    tabWidth: 4,
                    singleQuote: true,
                    printWidth: 100,
                    endOfLine: 'auto',
                },
                {
                    usePrettierrc: true,
                },
            ],
        },
        // Prettier configuration is now directly included through the prettierPlugin
    },

    // Configuration for non-TypeScript files
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },

    // Ignore patterns - expanded to exclude more files
    {
        ignores: [
            'dist/',
            'node_modules/',
            'coverage/',
            '.eslintrc.js',
            'schema.gql',
            '*.json',
            '*.png',
            '*.md',
            '.git',
            '.github',
            '.vscode',
            'test/',
        ],
    },

    // Add prettierPlugin recommended configuration directly
    {
        files: ['**/*'],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'warn',
        },
    },
];
