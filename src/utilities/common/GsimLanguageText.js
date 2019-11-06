export let getLocalizedGsimObjectText = (codeTextObj, languageCode) => {
  let text = codeTextObj ? codeTextObj.find(function (element) {return element.languageCode === languageCode}) : ''
  return text === undefined ? codeTextObj[0].languageText : text.languageText
}