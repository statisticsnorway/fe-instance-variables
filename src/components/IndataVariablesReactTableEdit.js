import React, { Component } from 'react'
import { Dropdown, Button, Input, Icon, Segment } from 'semantic-ui-react'
import ReactTable from 'react-table'
import {
  populateDropdown,
  mapLdmDropdownArray,
  getInstanceVariableFromLogicalRecords
} from '../utilities/GqlDataConverter'
import withFixedColumns from 'react-table-hoc-fixed-columns'
import 'react-table-hoc-fixed-columns/lib/styles.css'
import { request } from 'graphql-request'
import { get, put } from '../utilities/fetch/Fetch'
import { ALL_POPULATIONS } from '../services/graphql/queries/Population'
import { ALL_REPRESENTED_VARIABLES } from '../services/graphql/queries/RepresentedVariables'
import { DATASTRUCTURECOMPONENTTYPE, GSIM } from '../utilities/Enum'

const ReactTableFixedColumns = withFixedColumns(ReactTable)

class IndataVariablesReactTableEdit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      populations: [],
      representedVariables: [],
      dataStructureComponentTypes: DATASTRUCTURECOMPONENTTYPE,
      unitDataSets: [],
      unitDataSetArray: [],
      instanceVariables: [],
      columns: [],
      showColumns: [],
      error: '',
      lds: this.props.lds
    }
  }

  componentDidMount () {
    const { lds } = this.state
    const graphqlUrl = `${lds.url}/${lds.graphql}`
    Promise.all([request(graphqlUrl, ALL_POPULATIONS), request(graphqlUrl, ALL_REPRESENTED_VARIABLES)])
      .then(response => {
        this.setState({
            populations: response[0],
            instanceVariables: getInstanceVariableFromLogicalRecords(this.props.data),
            representedVariables: response[1]
          }
        )
      }).catch(console.error)
  }

  componentDidUpdate (prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({instanceVariables: getInstanceVariableFromLogicalRecords(this.props.data)})
    }
  }

  changeValue (variables, key, name, value) {
    variables.map((variable) => variable.instanceVariableKey === key ? variable[name] = value : null)
  }

  onChangeValue = (e, data) => {
    this.changeValue(this.state.instanceVariables.slice(), data.id, data.name, data.value)
    this.setState({instanceVariables: this.state.instanceVariables.slice()})
  }

  populateColumns = (showColumns, populations, representedVariables, dataStructureComponentTypes) => {
    return [
      {
        Header: 'InstanceVariable', fixed: 'left', columns: [
          {Header: 'name', accessor: 'instanceVariableName', width: 500, show: true}]
      },
      {
        Header: 'InstanceVariable', columns: [
          {
            Header: 'key', accessor: 'instanceVariableKey', width: 900, show: this.showColumn(showColumns,
              'instanceVariableKey')
          },
          {
            Header: 'description', accessor: 'instanceVariableDescription', width: 900, Cell: (row) => (
              <Input id={row.row.instanceVariableKey}
                     value={row.value}
                     name={'instanceVariableDescription'}
                     style={{width: 900}}
                     onChange={(e, data) => this.onChangeValue(e, data)}
              />), show: this.showColumn(showColumns, 'instanceVariableDescription')
          },
          {
            Header: 'shortName', accessor: 'instanceVariableShortName', width: 300, Cell: (row) => (
              <Input id={row.row.instanceVariableKey}
                     value={row.value}
                     name={'instanceVariableShortName'}
                     style={{width: 300}}
                     onChange={(e, data) => this.onChangeValue(e, data)}
              />), show: this.showColumn(showColumns, 'instanceVariableShortName')
          },
          {
            Header: 'dataStructureComponentType',
            accessor: 'instanceVariableDataStructureComponentType',
            width: 200,
            Cell: (row) => (
              <Dropdown style={{overflow: 'visible', position: 'relative'}}
                        selection
                        options={populateDropdown(mapLdmDropdownArray(dataStructureComponentTypes.DataStructureComponentType.edges))}
                        id={row.row.instanceVariableKey}
                        value={row.value}
                        onChange={(e, data) => this.onChangeDataStructureComponentType(e, data)}
              />),
            show: this.showColumn(showColumns, 'instanceVariableDataStructureComponentType')
          },
          {
            Header: 'formatMask', accessor: 'instanceVariableFormatMask', width: 200, Cell: (row) => (
              <Input id={row.row.instanceVariableKey}
                     value={row.value || ''}
                     name={'instanceVariableFormatMask'}
                     style={{width: 200}}
                     onChange={(e, data) => this.onChangeValue(e, data)}
              />), show: this.showColumn(showColumns, 'instanceVariableFormatMask')
          },
          {
            Header: 'population', accessor: 'population', width: 300, Cell: row => (
              <Dropdown style={{overflow: 'visible', position: 'relative'}}
                        selection
                        options={(populateDropdown(mapLdmDropdownArray(populations.Population.edges)))}
                        id={row.row.instanceVariableKey}
                        value={row.value}
                        onChange={(e, data) => this.onChangePopulation(e, data)}
              />
            ), show: this.showColumn(showColumns, 'population')
          },
          {
            Header: 'sentinelValueDomain', accessor: 'sentinelValueDomainName', width: 200, Cell: (row) => (
              <Input id={row.row.instanceVariableKey}
                     value={row.value || ''}
                     name={'sentinelValueDomainName'}
                     style={{width: 200}}
                     onChange={(e, data) => this.onChangeValue(e, data)}
              />), show: this.showColumn(showColumns, 'sentinelValueDomainName')
          }]
      },
      {
        Header: 'Represented variable', columns: [
          {
            Header: 'name', accessor: 'representedVariable', width: 300, Cell: row => (
              <Dropdown style={{overflow: 'visible', position: 'relative'}}
                        selection
                        options={populateDropdown(mapLdmDropdownArray(representedVariables.RepresentedVariable.edges))}
                        id={row.row.instanceVariableKey}
                        value={row.value}
                        onChange={(e, data) => this.onChangeRepresentedVariable(e, data)}
              />), show: this.showColumn(showColumns, 'representedVariableName')
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

  clickRowVariable = (rowInfo) => {
    console.log(rowInfo)
    let instVariables = this.state.instanceVariables
    let original = rowInfo.original
    let editVariable = instVariables[rowInfo.index]
    console.log(original)
    console.log(editVariable)
    // return this.variableTable(original)
  }

  //TODO: Refactor
  onChangePopulation = (e, data) => {
    let population = this.getSelectedOption(this.state.populations.Population.edges, data.value)
    let instVars = this.state.instanceVariables

    this.setState({instanceVariables: this.changePopulation(instVars, data.id, population)})
  }

  onChangeRepresentedVariable = (e, data) => {
    let representedVariable = this.getSelectedOption(this.state.representedVariables.RepresentedVariable.edges, data.value)
    let instVars = this.state.instanceVariables

    this.setState({instanceVariables: this.changeRepresentedVariable(instVars, data.id, representedVariable)})
  }

  onChangeDataStructureComponentType = (e, data) => {
    let instanceVariableDataStructureComponentType = this.getSelectedOption(this.state.dataStructureComponentTypes.DataStructureComponentType.edges, data.value)
    let instVars = this.state.instanceVariables

    this.setState({instanceVariables: this.changeDataStructureComponentType(instVars, data.id, instanceVariableDataStructureComponentType)})
  }

  changePopulation (variables, key, population) {
    let idx = variables.findIndex((variable) => {
      return variable.instanceVariableKey === key
    })
    variables[idx].population = population.node.id
    variables[idx].populationName = population.node.name
    return variables
  }

  changeRepresentedVariable (variables, key, representedVariable) {
    let idx = variables.findIndex((variable) => {
      return variable.instanceVariableKey === key
    })
    variables[idx].representedVariable = representedVariable.node.id
    variables[idx].representedVariableName = representedVariable.node.name[0].languageText
    variables[idx].representedVariableDescription = representedVariable.node.description[0].languageText
    variables[idx].representedVariableUniverse = representedVariable.node.universe.name[0].languageText
    variables[idx].representedVariableVariable = representedVariable.node.variable.name[0].languageText
    variables[idx].representedVariableVariableName = representedVariable.node.variable.name[0].languageText
    variables[idx].representedVariableVariableDescription = representedVariable.node.variable.description[0].languageText
    variables[idx].representedVariableVariableUnitTypen = representedVariable.node.variable.unitType.name[0].languageText
    return variables
  }

  changeDataStructureComponentType (variables, key, instanceVariableDataStructureComponentType) {
    let idx = variables.findIndex((variable) => {
      return variable.instanceVariableKey === key
    })
    variables[idx].instanceVariableDataStructureComponentType = instanceVariableDataStructureComponentType.node.id
    return variables
  }

  getSelectedOption (options, selected) {
    return options.find((option) => {
      return option.node.id === selected
    })
  }

  handleButtonStateClick = () => {
    console.log('State:' + JSON.stringify(this.state, null, 2))
  }

  handleSave = () => {
    const { lds } = this.props
    const ldsDataUrl= `${lds.url}/${lds.namespace}/${GSIM.INSTANCE_VARIABLE}`

    this.state.instanceVariables.forEach((instanceVariable) => {
      let updatedData = {}
      let isUpdated = false
      get(ldsDataUrl + '/' + instanceVariable.instanceVariableId).then(data => {
        updatedData = data
        if (data.description[0].languageText !== instanceVariable.instanceVariableDescription) {
          updatedData.description[0].languageText = instanceVariable.instanceVariableDescription
          isUpdated = true
        }
        if (data.shortName !== instanceVariable.instanceVariableShortName) {
          updatedData.shortName = instanceVariable.instanceVariableShortName
          isUpdated = true
        }
        if (data.dataStructureComponentType !== instanceVariable.instanceVariableDataStructureComponentType) {
          updatedData.dataStructureComponentType = instanceVariable.instanceVariableDataStructureComponentType
          isUpdated = true
        }
        if ((Object.is(data.formatMask, undefined) ? null : data.formatMask) !== instanceVariable.instanceVariableFormatMask) {
          updatedData.formatMask = instanceVariable.instanceVariableFormatMask
          isUpdated = true
        }
        if (data.population !== '/Population/' + instanceVariable.population) {
          updatedData.population = '/Population/' + instanceVariable.population
          isUpdated = true
        }
        if (data.sentinelValueDomain !== instanceVariable.sentinelValueDomain) {
          updatedData.sentinelValueDomain = instanceVariable.sentinelValueDomain
          isUpdated = true
        }
        if (data.representedVariable !== '/RepresentedVariable/' + instanceVariable.representedVariable) {
          updatedData.representedVariable = '/RepresentedVariable/' + instanceVariable.representedVariable
          isUpdated = true
        }

        if (isUpdated) {
          console.log(JSON.stringify(updatedData))
          put(ldsDataUrl + '/' + instanceVariable.instanceVariableId, JSON.stringify(updatedData)).then(response => {
              console.log(response)
            }
          ).catch(error =>
            console.log(error))
        }

      }).catch(error =>
        console.log(error)
      )
    })
  }

  render () {
    const {instanceVariables, populations, representedVariables, dataStructureComponentTypes} = this.state
    const {showColumns} = this.props

    let columns = this.populateColumns(showColumns, populations, representedVariables, dataStructureComponentTypes)

    return (
      <div>
        <Segment basic>
          <Button icon onClick={this.handleSave} floated='right'>
            <Icon name='save'/>
          </Button>
        </Segment>
        <Segment basic>
          <ReactTableFixedColumns style={{borderColor: 'purple', overflow: 'visible'}}
                                  data={instanceVariables}
                                  columns={columns}
                                  defaultPageSize={10}
                                  className="-striped -highlight -filters -fixed"
                                  sortable
                                  filterable
                                  defaultFilterMethod={this.filterMethod}
                                  getTrProps={(state, rowInfo) => ({
                                    onClick: () => {
                                      this.clickRowVariable(rowInfo)
                                      console.log('A row was clicked!')
                                    }
                                  })}
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
        </Segment>
      </div>)
  }
}

export default IndataVariablesReactTableEdit
