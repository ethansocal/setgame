module.exports = {
    extends: ["prettier"],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
        "react/jsx-key": "off",
    },
    env: {
        es6: true,
    },
    parserOptions: {
        ecmaVersion: "2020",
        sourceType: "module",
    },
};
