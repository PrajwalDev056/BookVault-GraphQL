const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const path = require('path');

// Define environment-aware rules
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = [
    // Apply prettier config - must come first to prevent conflicts
    prettierConfig,

    {
        // Apply TypeScript parser for TypeScript files
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                // Using createDefaultProgram can improve performance but with reduced type checking
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
            // TypeScript specific rules - reduced set for better performance
            '@typescript-eslint/explicit-function-return-type': 'warn', // Downgraded from error
            '@typescript-eslint/explicit-module-boundary-types': 'warn', // Downgraded from error
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn', // Downgraded from error
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            // Simplified naming convention rules for better performance
            '@typescript-eslint/naming-convention': [
                'warn', // Downgraded from error
                // Enforce camelCase for methods/properties
                {
                    selector: 'memberLike',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow', // Allow leading underscore for private members
                },
                // Allow PascalCase for classes/interfaces
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
                // Allow UPPER_CASE for constants and environment variable names
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

            // Import organization
            'import/order': [
                'warn', // Downgraded from error
                {
                    groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],

            // General code quality
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

            // Error handling
            'no-throw-literal': 'warn', // Downgraded from error

            // Turn off rules that conflict with Prettier
            indent: 'off',
            '@typescript-eslint/indent': 'off',

            // Prettier integration - simplified for performance
            'prettier/prettier': [
                'warn', // Downgraded from error
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
];
