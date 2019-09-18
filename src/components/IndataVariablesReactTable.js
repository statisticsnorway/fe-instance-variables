import React, { Component } from 'react'
import IndataVariablesReactTableView from './IndataVariablesReactTableView'
import IndataVariablesReactTableEdit from './IndataVariablesReactTableEdit'

class IndataVariablesReactTable extends Component {

  render () {
    const {mode, showColumns, data} = this.props

    if (mode === 'edit') {
      return <IndataVariablesReactTableEdit showColumns={showColumns} data={data}> </IndataVariablesReactTableEdit>
    }

    if (mode === 'view') {
      return <IndataVariablesReactTableView showColumns={showColumns} data={data}> </IndataVariablesReactTableView>
    }

    return null
  }

}

export default IndataVariablesReactTable
