module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'import'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules'],
    rules: {
        // TypeScript specific rules
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            // Enforce camelCase for methods/properties
            {
                selector: 'memberLike',
                format: ['camelCase', 'capitalized'],
            },
            // Allow PascalCase for classes/interfaces
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
        ],

        // Import organization
        'import/order': [
            'error',
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
            },
        ],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

        // Error handling
        'no-throw-literal': 'error',

        // GraphQL & NestJS specific conventions
        indent: ['error', 2],
        quotes: ['error', 'single', { avoidEscape: true }],
        semi: ['error', 'always'],
    },
};
