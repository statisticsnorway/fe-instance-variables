import React from 'react'

export const languages = {
  ENGLISH: {
    languageCode: 'en',
    flag: 'gb'
  },
  NORWEGIAN: {
    languageCode: 'nb',
    flag: 'no'
  }
}

export const LanguageContext = React.createContext(languages.NORWEGIAN.languageCode)
