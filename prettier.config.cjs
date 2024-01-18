/** @type {import("prettier").Config & import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  printWidth: 119,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  // @trivago/prettier-plugin-sort-importsの設定
  importOrder: ['<THIRD_PARTY_MODULES>', '^~', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
