import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  { ignores: ['**/.aws-sam/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    plugins: { '@stylistic': stylistic },
    languageOptions: {
      sourceType: 'module',
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
        bootstrap: 'readonly',
        Swiper: 'readonly',
        grecaptcha: 'readonly'
      }
    }
  }
]
