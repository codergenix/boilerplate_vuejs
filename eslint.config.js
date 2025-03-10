import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    ignores: ['dist/**','**/dist/**']
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    rules: {
      'eqeqeq': 'off',
      'no-self-assign': 'warn',
      'vue/require-v-for-key': 'warn',
      'no-useless-escape': 'warn',
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    },
  },
]
