import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import ReactTable from 'react-table'
import { populateVariableData } from '../utilities/GqlDataConverter'
import withFixedColumns from 'react-table-hoc-fixed-columns'
import 'react-table-hoc-fixed-columns/lib/styles.css'

const ReactTableFixedColumns = withFixedColumns(ReactTable)

class IndataVariablesReactTableView extends Component {
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
          {Header: 'name', accessor: 'instanceVariableName', width: 500, show: true}]
      },
      {
        Header: 'InstanceVariable', columns: [
          {
            Header: 'key',
            accessor: 'instanceVariableKey',
            width: 900,
            show: this.showColumn(showColumns, 'instanceVariableKey')
          },
          {
            Header: 'description',
            accessor: 'instanceVariableDescription',
            width: 900,
            show: this.showColumn(showColumns, 'instanceVariableDescription')
          },
          {
            Header: 'shortName',
            accessor: 'instanceVariableShortName',
            width: 900,
            show: this.showColumn(showColumns, 'instanceVariableShortName')
          },
          {
            Header: 'dataStructureComponentType',
            accessor: 'instanceVariableDataStructureComponentType',
            show: this.showColumn(showColumns, 'instanceVariableDataStructureComponentType')
          },
          {
            Header: 'formatMask',
            accessor: 'instanceVariableFormatMask',
            show: this.showColumn(showColumns, 'instanceVariableFormatMask')
          },
          {
            Header: 'population',
            accessor: 'populationName',
            width: 300,
            show: this.showColumn(showColumns, 'populationName')
          },
          {
            Header: 'sentinelValueDomain',
            accessor: 'sentinelValueDomainName',
            width: 300,
            show: this.showColumn(showColumns, 'sentinelValueDomainName')
          }]
      },
      {
        Header: 'Represented variable', columns: [
          {
            Header: 'name',
            accessor: 'representedVariableName',
            width: 300,
            show: this.showColumn(showColumns, 'representedVariableName')
          },
          {
            Header: 'description',
            accessor: 'representedVariableDescription',
            width: 300,
            show: this.showColumn(showColumns, 'representedVariableDescription')
          },
          {
            Header: 'universe',
            accessor: 'representedVariableUniverse',
            width: 300,
            show: this.showColumn(showColumns, 'representedVariableUniverse')
          },
          {
            Header: 'substantiveValueDomain',
            accessor: 'representedVariableSubstantiveValueDomain',
            width: 300,
            show: this.showColumn(showColumns, 'representedVariableSubstantiveValueDomain')
          }]
      },
      {
        Header: 'Variable', columns: [
          {
            Header: 'name',
            accessor: 'representedVariableVariableName',
            width: 300,
            show: this.showColumn(showColumns, 'variableName')
          },
          {
            Header: 'description',
            accessor: 'representedVariableVariableDescription',
            width: 300,
            show: this.showColumn(showColumns, 'variableDescription')
          },
          {
            Header: 'unitType',
            accessor: 'representedVariableVariableUnitType',
            width: 300,
            show: this.showColumn(showColumns, 'variableUnitType')
          }]
      }
    ]
  }

  showColumn = (showColumns, accessorName) => {
    let showCol = showColumns.find(col => col.name === accessorName)
    if (showCol != null) return showCol.show
    else return true
  }

  handleButtonStateClick = () => {
    console.log('State:' + JSON.stringify(this.state, null, 2))
  }

  render () {
    const {populations} = this.state
    const instanceVariables = populateVariableData(this.props.data)
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

export default IndataVariablesReactTableView
