import React, { Component } from 'react'
import { Dropdown, Button, Input, Icon, Message, Grid } from 'semantic-ui-react'
import ReactTable from 'react-table'
import {
  populateDropdown,
  mapLdmArray,
  getInstanceVariableFromLogicalRecords
} from '../utilities/GqlDataConverter'
import withFixedColumns from 'react-table-hoc-fixed-columns'
import 'react-table-hoc-fixed-columns/lib/styles.css'
import { request } from 'graphql-request'
import { get, put } from '../utilities/fetch/Fetch'
import { ALL_POPULATIONS } from '../services/graphql/queries/Population'
import { ALL_REPRESENTED_VARIABLES } from '../services/graphql/queries/RepresentedVariables'
import { DATASTRUCTURECOMPONENTTYPE, GSIM, MESSAGES, ICON } from '../utilities/Enum'
import { filterCaseInsensitive } from '../utilities/common/Filter'
import { getLocalizedGsimObjectText} from '../utilities/common/GsimLanguageText'

const ReactTableFixedColumns = withFixedColumns(ReactTable)

class InstanceVariablesTableEdit extends Component {
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
      message: '',
      messageIcon: '',
      messageColor: '',
      lds: this.props.lds
    }
  }

  componentDidMount () {
    const {lds} = this.state
    const graphqlUrl = `${lds.url}/${lds.graphql}`
    Promise.all([request(graphqlUrl, ALL_POPULATIONS), request(graphqlUrl, ALL_REPRESENTED_VARIABLES)])
      .then(response => {
        this.setState({
            populations: response[0],
            instanceVariables: getInstanceVariableFromLogicalRecords(this.props.data, this.props.language),
            representedVariables: response[1]
          }
        )
      }).catch(console.message)
  }

  componentDidUpdate (prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({instanceVariables: getInstanceVariableFromLogicalRecords(this.props.data, this.props.language)})
    }
  }

  changeValue (variables, key, name, value) {
    variables.map((variable) => variable.instanceVariableKey === key ? variable[name] = value : null)
  }

  onChangeValue = (e, data) => {
    this.changeValue(this.state.instanceVariables.slice(), data.id, data.name, data.value)
    this.setState({instanceVariables: this.state.instanceVariables.slice()})
  }

  populateColumns = (showColumns, populations, representedVariables, dataStructureComponentTypes, language) => {
    return [
      {
        Header: 'InstanceVariable', fixed: 'left', columns: [
          {Header: 'name', accessor: 'instanceVariableName', width: 700, show: true}]
      },
      {
        Header: 'InstanceVariable', columns: [
          {
            Header: 'key', accessor: 'instanceVariableKey', width: 600, show: this.showColumn(showColumns,
              'instanceVariableKey')
          },
          createColumn.call(this, 'description', 'instanceVariableDescription', 900,
            (row) => input(row, 'instanceVariableDescription', 900, this.onChangeValue)),
          createColumn.call(this, 'shortName', 'instanceVariableShortName', 300,
            (row) => input(row, 'instanceVariableShortName', 300, this.onChangeValue)),
          createColumn.call(this, 'dataStructureComponentType', 'instanceVariableDataStructureComponentType', 200,
            (row) => dropdown(row, 'instanceVariableDataStructureComponentType', 200,
                this.onChangeDataStructureComponentType, this.changeDataStructureComponentType, dataStructureComponentTypes.DataStructureComponentType.edges)),
          createColumn.call(this, 'formatMask', 'instanceVariableFormatMask', 200,
            (row) => input(row, 'instanceVariableFormatMask', 200, this.onChangeValue)),
          createColumn.call(this, 'population', 'populationName', 300,
            (row) => dropdown(row, 'populationName', 300, this.onChangePopulation, populations.Population.edges)),
          createColumn.call(this, 'sentinelValueDomain', 'sentinelValueDomainName', 200,
            (row) => input(row, 'sentinelValueDomainName', 200, this.onChangeValue))
        ]
      },
      {
        Header: 'Represented variable', columns: [
          createColumn.call(this, 'name', 'representedVariable', 300,
            (row) => dropdown(row, 'representedVariable', 300, this.onChangeRepresentedVariable, representedVariables.RepresentedVariable.edges)),
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

    function createColumn (header, accessor, width, cell) {
      return {Header: header,
        accessor: accessor,
        width: width,
        show: showColumn(showColumns, accessor),
        Cell: cell
      }
    }

    function showColumn (showColumns, accessorName)  {
      let showCol = showColumns.find(col => col.name === accessorName)
      if (showCol != null) return showCol.show
      else return true
    }

    function input(row, accessor, width, onchangemet) {
      return <Input id={row.row.instanceVariableKey}
             value={row.value || ''}
             name={accessor}
             style={{width: width}}
             onChange={(e, data) => onchangemet(e, data)}
      />
    }

    function dropdown(row, accessor, width, onchangemet, selectionchangemet, ldmarray) {
      return <Dropdown style={{overflow: 'visible', position: 'relative', width: width}}
                selection
                options={populateDropdown(mapLdmArray(ldmarray, language))}
                id={row.row.instanceVariableKey}
                value={row.value}
                onChange={(e, data) => onchangemet(e, data, selectionchangemet, ldmarray)}
      />
    }
  }



  showColumn = (showColumns, accessorName) => {
    let showCol = showColumns.find(col => col.name === accessorName)
    if (showCol != null) return showCol.show
    else return true
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
    // console.log(this.state.instanceVariables)
  }

  onChangeDataStructureComponentType = (e, data, optionsarray, optionchangemet) => {
    let instanceVariableDataStructureComponentType = this.getSelectedOption(optionsarray, data.value)
    let instVars = this.state.instanceVariables

    this.setState({instanceVariables: optionchangemet(instVars, data.id, instanceVariableDataStructureComponentType)})
  }

  getVariableIndex = (variables, key) =>
    variables.findIndex((variable) => {
      return variable.instanceVariableKey === key
    })


  changePopulation (variables, key, population) {
    let idx = this.getVariableIndex(variables, key)
    variables[idx].population = population.node.id
    variables[idx].populationName = population.node.name
    return variables
  }

  changeRepresentedVariable (variables, key, representedVariable) {
    let idx = this.getVariableIndex(variables, key)
    const language = this.props.language

    variables[idx].representedVariable = representedVariable.node.id
    variables[idx].representedVariableName = getLocalizedGsimObjectText(representedVariable.node.name, language)
    variables[idx].representedVariableDescription = getLocalizedGsimObjectText(representedVariable.node.description, language)
    variables[idx].representedVariableUniverse = getLocalizedGsimObjectText(representedVariable.node.universe.name, language)
    variables[idx].representedVariableSubstantiveValueDomain = getLocalizedGsimObjectText(representedVariable.node.substantiveValueDomain.name, language)
    variables[idx].representedVariableVariable = getLocalizedGsimObjectText(representedVariable.node.variable.name, language)
    variables[idx].representedVariableVariableName = getLocalizedGsimObjectText(representedVariable.node.variable.name, language)
    variables[idx].representedVariableVariableDescription = getLocalizedGsimObjectText(representedVariable.node.variable.description, language)
    variables[idx].representedVariableVariableUnitType = getLocalizedGsimObjectText(representedVariable.node.variable.unitType.name, language)
    return variables
  }

  changeDataStructureComponentType (variables, key, instanceVariableDataStructureComponentType) {
    let idx = this.getVariableIndex(variables, key)
    variables[idx].instanceVariableDataStructureComponentType = instanceVariableDataStructureComponentType.node.id
    return variables
  }

  getSelectedOption (options, selected) {
    return options.find((option) => {
      return option.node.id === selected
    })
  }

  // handleButtonStateClick = () => {
  //   console.log('State:' + JSON.stringify(this.state, null, 2))
  // }

  handleSave = () => {
    const {lds} = this.props
    const ldsDataUrl = `${lds.url}/${lds.namespace}/${GSIM.INSTANCE_VARIABLE}`

    this.state.instanceVariables.forEach((instanceVariable) => {
      let updatedData = {}
      let isUpdated = false
      get(ldsDataUrl + '/' + instanceVariable.instanceVariableId).then(data => {
        updatedData = data
        if ((data.description && data.description[0] && data.description[0].languageText) !== instanceVariable.instanceVariableDescription) {
          updatedData.description[0].languageText = instanceVariable.instanceVariableDescription
          isUpdated = true
        }
        if (data['shortName'] !== instanceVariable['instanceVariableShortName']) {
          updatedData['shortName'] = instanceVariable['instanceVariableShortName']
          isUpdated = true
        }
        if (data['dataStructureComponentType'] !== instanceVariable['instanceVariableDataStructureComponentType']) {
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
          console.log(JSON.stringify(updatedData), 'updatedData')
          put(ldsDataUrl + '/' + instanceVariable.instanceVariableId, JSON.stringify(updatedData)).then(response => {
              console.log(response)
              this.setState({
                message: MESSAGES.SAVE_SUCCESSFUL[this.props.language],
                messageColor: 'green',
                messageIcon: ICON.INFO_MESSAGE
              })
            }
          ).catch(message => {
              console.log(message)
              this.setState({
                message: MESSAGES.ERROR[this.props.language],
                messageColor: 'red',
                messageIcon: ICON.ERROR_MESSAGE
              })
            }
          )
        }

      }).catch(message =>
        console.log(message)
      )
    })
  }

  render () {
    const {instanceVariables, populations, representedVariables, dataStructureComponentTypes, message, messageColor, messageIcon} = this.state
    const {showColumns} = this.props

    let columns = this.populateColumns(showColumns, populations, representedVariables, dataStructureComponentTypes)

    return (
      <div>
        {message && <Message color={messageColor} icon={messageIcon} content={message}/>}
        <Grid>
          <Grid.Row>
            <Grid.Column floated='left'>
            </Grid.Column>
            <Grid.Column floated='right'>
              <Button icon onClick={this.handleSave} floated='right'>
                <Icon name='save'/>
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <ReactTableFixedColumns style={{borderColor: 'purple', overflow: 'visible'}}
                                      data={instanceVariables}
                                      columns={columns}
                                      defaultPageSize={10}
                                      className="-striped -highlight -filters -fixed"
                                      sortable
                                      filterable
                                      defaultFilterMethod={filterCaseInsensitive}
                                      getTrProps={() => ({
                                        onClick: () => {
                                          this.setState({
                                            message: '',
                                            messageColor: '',
                                            messageIcon: ''
                                          })
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
            </Grid.Column>
          </Grid.Row>
        </Grid>

      </div>)
  }
}

export default InstanceVariablesTableEdit
