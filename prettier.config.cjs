/** @type {import("prettier").Config} */
const config = {
    plugins: [require.resolve("prettier-plugin-tailwindcss")],
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 80,
    useTabs: true,
    tabWidth: 2
};

module.exports = config;
