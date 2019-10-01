export function populateDropdown(enumList) {
  let options = []
  if (enumList) {
    Object.keys(enumList).forEach(enumItem => {
      let key = enumItem
      let text = enumList[enumItem]
      let value = enumList[enumItem]
      options.push(
        {key, text, value})
    })
  } else {
    console.warn('No dropdowncontent found.')
  }
  return options
}
