const js = require('@eslint/js')
const stylistic = require('@stylistic/eslint-plugin')
const globals = require('globals')

module.exports = [
  { ignores: ['**/.aws-sam/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    plugins: { '@stylistic': stylistic },
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      '@stylistic/semi': ['error', 'never'],
      'func-style': ['error', 'expression']
    }
  },
  {
    files: ['app/public/scripts/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        $: 'readonly',
        Swiper: 'readonly'
      }
    }
  }
]
