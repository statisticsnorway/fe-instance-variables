import React, { Component } from 'react'
import './App.css'
import InstanceVariables from './components/InstanceVariables'
import { LanguageContext } from './utilities/context/LanguageContext'

class App extends Component {

  state = {
    languageCode: 'nb',
    lds: {
      namespace: 'ns',
      url: process.env.REACT_APP_LDS ? process.env.REACT_APP_LDS : 'http://localhost:9090',
      user: 'Test user',
      graphql: 'graphql'
    }
  }

  setLanguage = (languageCode) => {
    this.setState({ languageCode: languageCode }, () => {
      localStorage.setItem('languageCode', languageCode)
    })
  }

  render () {
    const { languageCode, lds } = this.state

  return (
    <LanguageContext.Provider value={{
      value: languageCode,
      setLanguage: (languageCode) => this.setLanguage(languageCode)
    }}>
      <InstanceVariables
        languageCode = {languageCode}
        lds = {lds}
      />
    </LanguageContext.Provider>
  )
  }
}

export default App
