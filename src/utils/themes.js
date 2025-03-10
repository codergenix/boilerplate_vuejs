import themes from 'devextreme/ui/themes'
import _ from 'lodash'
import { ref } from 'vue'
import themeIconsContext from '@/services/theme-icon-context'
// color ['#028bc9','#b8c723','#f1582c','#7d1f8d','#009688']
const supportedThemesNames = [
  'material.orange.light.compact', 'material.orange.light', 'material.orange.dark.compact', 'material.orange.dark',
  'material.blue.light.compact','material.blue.light','material.blue.dark.compact','material.blue.dark',
  'material.lime.light.compact','material.lime.light','material.lime.dark.compact','material.lime.dark',
  'material.purple.light.compact','material.purple.light','material.purple.dark.compact','material.purple.dark',
  'material.teal.light.compact','material.teal.light','material.teal.dark.compact','material.teal.dark',
]
// const themeIconsContext = import.meta.glob('@/assets/themes/icons/*.svg')
const parseThemeName = (themeName) => {
  const parts = themeName.split('.')
  const upperCaseParts = _.map(
    parts,
    (part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`
  )
  return _.join(upperCaseParts, ' ')
}
const themeOptions = _.map(themeIconsContext, (dynamicImport, fileName) => {
  const iconName = fileName.split('/').pop()
  const partialThemeName = iconName.replace('.svg', '')
  const themeName = themes.isMaterial(partialThemeName)
    ? partialThemeName
    : `generic.${partialThemeName}`
  return {
    name: parseThemeName(themeName),
    iconName,
    themeName,
    icon: `/src/assets/themes/icons/${iconName}`,
    isMaterial: themes.isMaterial(themeName),
    isCompact: themes.isCompact(themeName)
  }
})
const filteredThemeOptions = _.filter(themeOptions, (item) =>
  _.includes(supportedThemesNames, item.themeName)
)
const orderedThemes = _.orderBy(filteredThemeOptions, ['isMaterial', 'isCompact'])
const themesGroupsData = _.groupBy(orderedThemes, (item) => {
  const groupName = item.isMaterial ? 'Material Design' : 'Generic'
  return item.isCompact ? `${groupName} Compact` : groupName
})
const groupedThemesData = _.flatMap(themesGroupsData, (value, key) => ({
  key,
  items: value
}))
const defaultThemeName = 'material.orange.light'
const defaultValue = () => {
  const storedThemeName = localStorage.getItem('webAppStoredTheme')
  if (storedThemeName) {
    const themeInfo = _.find(orderedThemes, (item) => item.themeName === storedThemeName)
    if (themeInfo) {
      return themeInfo.themeName
    }
    localStorage.setItem('webAppStoredTheme', defaultThemeName)
    return defaultThemeName
  }
  localStorage.setItem('webAppStoredTheme', defaultThemeName)
  return defaultThemeName
}
const getAppFontSize = () => {
  const element = document.querySelector('[class^="dx-viewport"]')
  const elementComputedStyle = getComputedStyle(element)
  const elementComputedStyleFontSize = elementComputedStyle.fontSize
  return parseInt(elementComputedStyleFontSize, 10)
}
const getMenuMinWidth = () => Math.round(getAppFontSize() * 4.4)
export default class AppThemes {
  static themesDataSource = groupedThemesData
  static selectedTheme = defaultValue()
  static reloadMethod
  static menuMinWidth = ref(0)
  static onAppMount() {
    themes.initialized(() => {
      AppThemes.menuMinWidth.value = getMenuMinWidth()
    })
    themes.current(AppThemes.selectedTheme)
  }
  static onThemeChangedEvent(e) {
    localStorage.setItem('webAppStoredTheme', e.value)
    AppThemes.selectedTheme = e.value
    themes.ready(() => {
      AppThemes.menuMinWidth.value = getMenuMinWidth()
    })
    themes.current(e.value);
    // const isCompact = _.includes(AppThemes.selectedTheme, "compact");
    // if (isCompact) {
    //   document.querySelector(".dx-theme-background-color.main")?.classList?.remove('nocompact');
    //   document.querySelector(".dx-theme-background-color.main")?.classList?.add('dx-theme-compact');
    // } else {
    //   document.querySelector(".dx-theme-background-color.main")?.classList?.remove('dx-theme-compact');
    //   document.querySelector(".dx-theme-background-color.main")?.classList?.add('nocompact');
    // }
    AppThemes.reloadMethod();
  }
}
