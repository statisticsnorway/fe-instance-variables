import React, { Component } from 'react'
import ReactTable from 'react-table'
import { getInstanceVariableFromLogicalRecords } from '../utilities/GqlDataConverter'
import withFixedColumns from 'react-table-hoc-fixed-columns'
import 'react-table-hoc-fixed-columns/lib/styles.css'

const ReactTableFixedColumns = withFixedColumns(ReactTable)

class InstanceVariablesTableView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      populations: [],
      unitDataSets: [],
      unitDataSetArray: [],
      instanceVariables: [],
      columns: [],
      showColumns: []
    }
  }

  populateColumns = (showColumns) => {

    return [
      {
        Header: 'InstanceVariable', fixed: 'left', columns: [
          {Header: 'name', accessor: 'instanceVariableName', width: 500, show: true}
        ]
      },
      {
        Header: 'InstanceVariable', columns: [
          createColumn.call(this, 'key', 'instanceVariableKey', 900),
          createColumn.call(this, 'descriptions', 'instanceVariableDescription', 900),
          createColumn.call(this, 'shortName', 'instanceVariableShortName', 300),
          createColumn.call(this, 'dataStructureComponentType', 'instanceVariableDataStructureComponentType', 200),
          createColumn.call(this, 'formatMask', 'instanceVariableFormatMask', 200),
          createColumn.call(this, 'population', 'populationName', 300),
          createColumn.call(this, 'sentinelValueDomain', 'sentinelValueDomainName')
        ]
      },
      {
        Header: 'Represented variable', columns: [
          createColumn.call(this, 'name', 'representedVariableName', 300),
          createColumn.call(this, 'description', 'representedVariableDescription', 300),
          createColumn.call(this, 'universe', 'representedVariableUniverse', 300),
          createColumn.call(this, 'substantiveValueDomain', 'representedVariableSubstantiveValueDomain', 300)
        ]
      },
      {
        Header: 'Variable', columns: [
          createColumn.call(this, 'name', 'representedVariableVariableName', 300),
          createColumn.call(this, 'description', 'representedVariableVariableDescription', 300),
          createColumn.call(this, 'unitType', 'representedVariableVariableUnitType', 300)
        ]
      }
    ]

    function createColumn (header, accessor, width) {
      return {Header: header,
        accessor: accessor,
        width: width,
        show: this.showColumn(showColumns, accessor)
      }
    }
  }

  showColumn = (showColumns, accessorName) => {
    let showCol = showColumns.find(col => col.name === accessorName)
    if (showCol != null) return showCol.show
    else return true
  }

  // handleButtonStateClick = () => {
  //   console.log('State:' + JSON.stringify(this.state, null, 2))
  // }

  render () {
    const {populations} = this.state
    const instanceVariables = this.props.data ? getInstanceVariableFromLogicalRecords(this.props.data) : []
    const {showColumns} = this.props
    const columns = this.populateColumns(showColumns, populations)

    return (
      <div>
        <ReactTableFixedColumns style={{borderColor: 'purple', overflow: 'visible'}}
                                data={instanceVariables}
                                columns={columns}
                                defaultPageSize={10}
                                className="-striped -highlight -filters -fixed"
                                sortable
                                filterable
                                defaultFilterMethod={this.filterMethod}
                                getTdProps={() => {
                                  return {
                                    style: {
                                      overflow: 'visible'
                                    }
                                  }
                                }}
        />
        {/*
        <Button onClick={this.handleButtonStateClick}>Show state</Button>
        */}
      </div>)
  }
}

export default InstanceVariablesTableView
