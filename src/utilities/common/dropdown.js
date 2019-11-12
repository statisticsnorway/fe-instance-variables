export function populateDropdown(enumList) {
  return  Object.keys(enumList).map(enumItem => ({key: enumItem, text: enumList[enumItem], value: enumList[enumItem]}))
}

export function getSelectedOption (options, selected) {
  return options.find((option) => {
    return option.node.id === selected
  })
}