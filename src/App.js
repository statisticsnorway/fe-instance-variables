import React, { Component } from 'react'
import './App.css'
import InstanceVariables from './components/InstanceVariables'

class App extends Component {
  state = {
    languageCode: 'nb',
    lds: {
      namespace: 'ns',
      url: 'https://reactapp.staging-bip-app.ssb.no/be/lds',
      //url: process.env.REACT_APP_LDS ? process.env.REACT_APP_LDS : 'http://localhost:9090',
      // url: 'http://localhost:9090',
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
