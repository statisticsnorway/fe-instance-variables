import React, { Component } from 'react'
import './App.css'
import InstanceVariables from './components/InstanceVariables'

class App extends Component {
  state = {
    languageCode: 'nb',
    lds: {
      namespace: 'data',
      url: 'http://localhost:9090',
      user: 'Test user',
      graphql: 'graphql'
    }
  }

  render () {
    const { languageCode, lds } = this.state

  return (
    <InstanceVariables
      languageCode = {languageCode}
      lds = {lds}
    />
  )
  }
}

export default App
