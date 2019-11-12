import React, { Component } from 'react'
import { Dropdown, Button, Input, Icon, Message, Grid } from 'semantic-ui-react'
import ReactTable from 'react-table'
import {
  populateDropdown,
  mapLdmArray,
  getInstanceVariableFromLogicalRecords,
  getVariableIndex,
  getValueDomains
} from '../utilities/GqlDataConverter'
import withFixedColumns from 'react-table-hoc-fixed-columns'
import 'react-table-hoc-fixed-columns/lib/styles.css'
import { request } from 'graphql-request'
import { get, put } from '../utilities/fetch/Fetch'
import { ALL_DESCRIBED_VALUE_DOMAINS, ALL_ENUMERATED_VALUE_DOMAINS } from '../services/graphql/queries/ValueDomain'
import { ALL_POPULATIONS } from '../services/graphql/queries/Population'
import { ALL_REPRESENTED_VARIABLES } from '../services/graphql/queries/RepresentedVariables'
import { DATASTRUCTURECOMPONENTTYPE, GSIM, MESSAGES, ICON } from '../utilities/Enum'
import { filterCaseInsensitive } from '../utilities/common/Filter'
import { getLocalizedGsimObjectText, setLocalizedGsimObjectText} from '../utilities/common/GsimLanguageText'
import { getSelectedOption } from '../utilities/common/dropdown'

const ReactTableFixedColumns = withFixedColumns(ReactTable)

class InstanceVariablesTableEdit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sentinelValueDomains: [],
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
    Promise.all([
          request(graphqlUrl, ALL_DESCRIBED_VALUE_DOMAINS),
          request(graphqlUrl, ALL_ENUMERATED_VALUE_DOMAINS),
          request(graphqlUrl, ALL_POPULATIONS),
          request(graphqlUrl, ALL_REPRESENTED_VARIABLES)
    ]).then(response => {
        this.setState({
            sentinelValueDomains: getValueDomains(response[0], response[1]),
            populations: response[2],
            instanceVariables: getInstanceVariableFromLogicalRecords(this.props.data, this.props.language),
            representedVariables: response[3]
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

  populateColumns = (showColumns, sentinelValueDomains, populations, representedVariables, dataStructureComponentTypes, language) => {
    const sentinelValueOptions = sentinelValueDomains.ValueDomain ? populateDropdown(mapLdmArray(sentinelValueDomains.ValueDomain.edges, language)) : []
    const populationOptions = populations.Population ? populateDropdown(mapLdmArray(populations.Population.edges, language)) : []
    const representedVariableOptions = representedVariables.RepresentedVariable ? populateDropdown(mapLdmArray(representedVariables.RepresentedVariable.edges, language)) : []
    const dataStructureComponentTypeOptions = dataStructureComponentTypes.DataStructureComponentType ? populateDropdown(mapLdmArray(dataStructureComponentTypes.DataStructureComponentType.edges, language)) : []
    return [
      {
        Header: 'InstanceVariable', fixed: 'left', columns: [
          {Header: 'name', accessor: 'instanceVariableName', width: 700, show: true}]
      },
      {
        Header: 'InstanceVariable', columns: [
          {
            Header: 'key', accessor: 'instanceVariableKey', width: 600, show: showColumn(showColumns,'instanceVariableKey')
          },
          createColumn.call(this, 'description', 'instanceVariableDescription', 900,
            (row) => input(row, 'instanceVariableDescription', 900, this.onChangeValue)),
          createColumn.call(this, 'shortName', 'instanceVariableShortName', 300,
            (row) => input(row, 'instanceVariableShortName', 300, this.onChangeValue)),
          createColumn.call(this, 'dataStructureComponentType', 'instanceVariableDataStructureComponentType', 200,
            (row) => dropdown(row, 'instanceVariableDataStructureComponentType', 200,
              this.onChangeValue, this.null, dataStructureComponentTypeOptions)),
          createColumn.call(this, 'formatMask', 'instanceVariableFormatMask', 200,
            (row) => input(row, 'instanceVariableFormatMask', 200, this.onChangeValue)),
          createColumn.call(this, 'population', 'population', 300,
            (row) => dropdown(row, 'population', 300, this.onChangeValue, null, populationOptions)),
          createColumn.call(this, 'sentinelValueDomain', 'sentinelValueDomain', 300,
            (row) => dropdown(row, 'sentinelValueDomain', 300, this.onChangeValue,null, sentinelValueOptions))
        ]
      },
      {
        Header: 'Represented variable', columns: [
          createColumn.call(this, 'name', 'representedVariable', 300,
            (row) => dropdown(row, 'representedVariable', 300, this.onChangeOptions, this.changeRepresentedVariable,
              representedVariableOptions, representedVariables.RepresentedVariable.edges)),
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

    function dropdown(row, accessor, width, onchangemet, selectionchangemet, options, ldmArray) {
      return <Dropdown style={{overflow: 'visible', position: 'relative', width: width}}
                selection
                options={options}
                name={accessor}
                id={row.row.instanceVariableKey}
                value={row.value}
                onChange={(e, data) => onchangemet(e, data, selectionchangemet, ldmArray, language)}
      />
    }
  }

  onChangeOptions = (e, data, optionschangemet, optionsarray, language) => {
    console.log(data, 'data')
    console.log(optionschangemet, 'optionschangemet')
    console.log(optionsarray, 'optionsarray')
    let selected = getSelectedOption(optionsarray, data.value, language)
    this.setState(prevState => ({
      [data.name]: data.value,
      instanceVariables: optionschangemet(prevState.instanceVariables, data.id, selected, language)
    }))
  }




  changeRepresentedVariable (variables, key, representedVariable, language) {
    let idx = getVariableIndex(variables, key)

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

  // handleButtonStateClick = () => {
  //   console.log('State:' + JSON.stringify(this.state, null, 2))
  // }

  handleSave = () => {
    const {lds} = this.props
    const ldsDataUrl = `${lds.url}/${lds.namespace}/${GSIM.INSTANCE_VARIABLE}`
    const language = this.props.language

    this.state.instanceVariables.forEach((instanceVariable) => {
      let updatedData = {}
      let isUpdated = false
      get(ldsDataUrl + '/' + instanceVariable.instanceVariableId).then(data => {
        updatedData = data
        if (data['id'] === '3') {
          console.log(updatedData, 'updated data før sjekk på ulikheter')
          console.log(isUpdated, 'isUpdated')
        }
        [updatedData, isUpdated] = this.setUpdatedDataIfChange(updatedData, data,'description', instanceVariable['instanceVariableDescription'], language, isUpdated)
        [updatedData, isUpdated] = this.setUpdatedDataIfChange(updatedData, data,'shortName', instanceVariable['instanceVariableShortName'], language, isUpdated)
        [updatedData, isUpdated] = this.setUpdatedDataIfChange(updatedData, data,'dataStructureComponentType', instanceVariable['instanceVariableDataStructureComponentType'], language, isUpdated)
        [updatedData, isUpdated] = this.setUpdatedDataIfChange(updatedData, data,'formatMask', instanceVariable['instanceVariableFormatMask'], language, isUpdated)
        [updatedData, isUpdated] = this.setUpdatedDataIfChange(updatedData, data,'population', '/Population/' + instanceVariable['population'], language, isUpdated)
        [updatedData, isUpdated] = this.setUpdatedDataIfChange(updatedData, data,'sentinelValueDomain', instanceVariable['sentinelValueDomain'] ? '/SentinelValueDomain/' + instanceVariable['sentinelValueDomain'] : null, language, isUpdated)
        [updatedData, isUpdated] = this.setUpdatedDataIfChange(updatedData, data,'representedVariable', '/RepresentedVariable/' + instanceVariable['representedVariable'], language, isUpdated)
        if ((Object.is(data.formatMask, undefined) ? null : data.formatMask) !== instanceVariable.instanceVariableFormatMask) {
          updatedData.formatMask = instanceVariable.instanceVariableFormatMask
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

  setUpdatedDataIfChange(updatedData, data, dataName, instanceVariableValue, language, isUpdated) {
    let dataValue = Array.isArray(data[dataName]) ? getLocalizedGsimObjectText(data[dataName], language) : data[dataName]
    if (dataValue !== instanceVariableValue) {
      updatedData[dataName] = Array.isArray(data[dataName]) ? setLocalizedGsimObjectText(updatedData[dataName], language, instanceVariableValue) : instanceVariableValue
      isUpdated = true
    }
    return [updatedData, isUpdated]
  }


  render () {
    const {instanceVariables, sentinelValueDomains, populations, representedVariables, dataStructureComponentTypes, message, messageColor, messageIcon} = this.state
    const {showColumns} = this.props

    console.log(populations, 'populations in render()')
    console.log(representedVariables, 'representedVariables in render()')
    console.log(dataStructureComponentTypes, 'dataStructureComponentTypes in render()')

    let columns = this.populateColumns(showColumns, sentinelValueDomains, populations, representedVariables, dataStructureComponentTypes, this.props.language)

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
