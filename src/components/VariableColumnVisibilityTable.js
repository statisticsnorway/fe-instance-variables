import React, { Component } from 'react'
import { Checkbox, Table, Grid, Popup, Button, Icon } from 'semantic-ui-react'
import IndataVariablesReactTable from './IndataVariablesReactTable'
import { UI, ICON } from '../utilities/Enum'

class VariableColumnVisibilityTable extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showColumns: [],
      indataVariablesReactTableMode: 'view',
      data: this.props.data
    }
  }

  componentDidMount () {
    this.setState({showColumns: this.populateShowColumns()})
  }

  populateShowColumns = () => {
    return [
      {name: 'instanceVariableKey', show: false},
      {name: 'instanceVariableName', show: false},
      {name: 'instanceVariableDescription', show: true},
      {name: 'instanceVariableDataStructureComponentType', show: true},
      {name: 'instanceVariableFormatMask', show: true},
      {name: 'populationName', show: true},
      {name: 'sentinelValueDomainName', show: true},
      {name: 'representedVariableName', show: true},
      {name: 'representedVariableDescription', show: true},
      {name: 'representedVariableUniverse', show: true},
      {name: 'representedVariableSubstantiveValueDomain', show: true},
      {name: 'variableName', show: true},
      {name: 'variableDescription', show: true},
      {name: 'variableUnitType', show: true}
    ]
  }

  toggleColumnVisibility = (e, columnName) => {
    let showColumns = this.state.showColumns
    let colIdx = showColumns.findIndex(col => col.name === columnName)
    if (colIdx > -1) showColumns[colIdx].show = !showColumns[colIdx].show
    this.setState({showColumns: showColumns})
  }

  variableTable = (showColumns) => (
    <Table collapsing style={{borderColor: 'violet'}}>
      <Table.Body>
        {showColumns.map(column =>
          <Table.Row key={column.name} style={{height: '3', color: 'blue'}}>
            <Table.Cell>
              <Checkbox label={column.name}
                        key={column.name} checked={column.show}
                        onChange={() => this.toggleColumnVisibility(this, column.name)}/>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )

  handleEditClick = () => {
    this.setState({indataVariablesReactTableMode: 'edit'})
  }

  handleViewClick = () => {
    this.setState({indataVariablesReactTableMode: 'view'})
  }

  render () {
    const {showColumns, indataVariablesReactTableMode} = this.state

    return (
        <Grid>
          <Grid.Row style={{borderColor: 'b', overflow: 'visible'}}>
            <Grid.Column floated='left'>
              <Popup on='click' content={this.variableTable(showColumns)}
                     trigger={<Button label={UI.SHOW_VARIABLES.nb} style={{borderColor: 'blue'}}/>}/>
            </Grid.Column>
            <Grid.Column floated='right'>
              {indataVariablesReactTableMode === 'view' &&
              <Button icon onClick={this.handleEditClick}>
                <Icon name={ICON.EDIT}
                      data-testid='iconEdit'/>
              </Button>}
              {indataVariablesReactTableMode === 'edit' &&
              <Button icon onClick={this.handleViewClick}>
                <Icon name={ICON.VIEW}
                      data-testid='iconView'/>
              </Button>}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <IndataVariablesReactTable mode={indataVariablesReactTableMode} showColumns={showColumns}
                                         data={this.props.data} lds={this.props.lds}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
    )

  }
}

export default VariableColumnVisibilityTable
