module.exports = {
  "env": {
    "browser": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 5
  },
  "globals": {
    "Promise": true
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ]
  }
};
