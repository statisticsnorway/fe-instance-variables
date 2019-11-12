import React, { Component } from 'react'
import IndataVariablesReactTableView from './InstanceVariablesTableView'
import Testing from './Testing'

class InstanceVariablesTable extends Component {

  render () {
    const { mode, showColumns, data, lds, language } = this.props

    if (mode === 'edit') {
      //return <InstanceVariablesTableEdit showColumns={showColumns} data={data} lds={lds} language={language}> </InstanceVariablesTableEdit>
      return <Testing data={data} lds={lds} language={language} />
    }

    if (mode === 'view') {
      return <IndataVariablesReactTableView showColumns={showColumns} data={data}
                                            lds={lds} language={language}> </IndataVariablesReactTableView>
    }

    return null
  }

}

export default InstanceVariablesTable
