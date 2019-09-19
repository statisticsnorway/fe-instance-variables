import React, { Component } from 'react'
import IndataVariablesReactTableView from './IndataVariablesReactTableView'
import IndataVariablesReactTableEdit from './IndataVariablesReactTableEdit'

class IndataVariablesReactTable extends Component {

  render () {
    const {mode, showColumns, data, lds} = this.props

    if (mode === 'edit') {
      return <IndataVariablesReactTableEdit showColumns={showColumns} data={data} lds={lds}> </IndataVariablesReactTableEdit>
    }

    if (mode === 'view') {
      return <IndataVariablesReactTableView showColumns={showColumns} data={data} lds={lds}> </IndataVariablesReactTableView>
    }

    return null
  }

}

export default IndataVariablesReactTable
