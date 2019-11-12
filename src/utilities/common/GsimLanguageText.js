export let getLocalizedGsimObjectText = (codeTextObj, languageCode) => {
  let text = codeTextObj ? codeTextObj.find(element => element.languageCode === languageCode) : ''
  return text === undefined ? codeTextObj[0].languageText : text.languageText
}

export let setLocalizedGsimObjectText = (codeTextObj, languageCode, newText) => {
  let index = codeTextObj.findIndex(element => element.languageCode === languageCode)
  console.log(index, 'index')
  let changedElement = codeTextObj[index]
  console.log(changedElement, 'changed element')
  changedElement.languageText = newText
  console.log(changedElement, 'changed element with new text')

  codeTextObj.splice(index, 1, changedElement)
  console.log(codeTextObj, 'changed codeTextObject')
  return codeTextObj
}