import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// A fill Col wearing theme.css's ueca-focus-bleed takes width={"auto"} - the note beside the utility
// says why. Each attribute is a direct child (`>`), so a Col passed in another's attribute lends it
// nothing; and as `:has(> A B)` never matches, the literal is looked for with a nested :has.
const fillColHeldToFullWidth = [
  'JSXOpeningElement[name.name="Col"]',
  ':has(> JSXAttribute[name.name="className"]:has(Literal[value=/(^|\\s)ueca-focus-bleed(\\s|$)/]))',
  ':has(> JSXAttribute[name.name="fill"])',
  ':not(:has(> JSXAttribute[name.name="width"]:has(Literal[value="auto"])))',
].join('')

export default tseslint.config(
  {
    ignores: [
      'dist',
      // MSW's generated worker - not ours to lint or edit.
      'public/mockServiceWorker.js',
      'src/screens/buttons/**',
      'src/screens/inputs/**',
      'src/screens/layout/**',
      'src/screens/misc/**',
      'src/screens/navigation/**',
      'src/screens/popups/**',
      'src/screens/tabs/**',
    ]
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'react-refresh/only-export-components': 'off',
    },

  },
  {
    files: ['**/*.tsx'],
    rules: {
      'no-restricted-syntax': ['error', {
        selector: fillColHeldToFullWidth,
        message: 'A fill Col wearing ueca-focus-bleed takes width={"auto"}: against the width: 100% that fill writes, the bleed margins shift it left and its content loses twice the bleed on the right. See theme.css.',
      }],
    },
  },
)
