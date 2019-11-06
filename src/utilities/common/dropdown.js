export function populateDropdown(enumList) {
  return  Object.keys(enumList).map(enumItem => ({key: enumItem, text: enumList[enumItem], value: enumList[enumItem]}))
}