import React, { Component } from 'react'
import { Header, Segment, Grid, Icon, Input, Button, Dropdown, Message } from 'semantic-ui-react'
import VariableColumnVisibilityTable from './VariableColumnVisibilityTable'
import { request } from 'graphql-request'
import { DATARESOURCE_WITH_STRUCTURE } from '../services/graphql/queries/DataResource'
import { DATASET_WITH_STRUCTURE } from '../services/graphql/queries/DataSet'
import { UI, LDS_URL, MESSAGES } from '../utilities/Enum'
import { SSBLogo } from '../media/Logo'
import { populateDropdown } from '../utilities/common/dropdown'

class InstanceVariables extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoading: false,
      result: [],
      id: '',
      datasetid: '',
      error: '',
      ready: false,
      lds: props.lds
    }

    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (event, data) => {
    this.setState({[data.name]: data.value})
  }

  handleOnClick = () => {
    const queryParam = {id: this.state.id}
    const { lds } = this.state
    const graphqlUrl = `${lds.url}/${lds.graphql}`

    request(graphqlUrl, DATARESOURCE_WITH_STRUCTURE, queryParam)
      .then(dataresource => {
        this.setState({result: dataresource.DataResourceById.dataSets.edges, ready: true}, () => {
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({result: [], error: error})
      })
  }

  handleOnDataSetSearchClick = () => {
    const queryParam = {id: this.state.datasetid}
    const { lds } = this.state
    const graphqlUrl = `${lds.url}/${lds.graphql}`

    request(graphqlUrl, DATASET_WITH_STRUCTURE, queryParam)
      .then(dataset => {
        this.setState({result: [dataset], ready: true}, () => {
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({result: [], error: error})
      })
  }

  onChangeLds = (e, data) => {
    this.setState(
      prevState => ({
        lds: {
          ...prevState.lds,
          url: data.value
        }
      })
    )
  }


  render () {
    const { id, datasetid, result, ready, error, lds } = this.state

    return (
      <Segment basic>
        <Segment basic>
          <Grid columns={2} divided>
            <Grid.Column textAlign='left'>
              <Grid.Row>
              <Header as='h2' icon>
                <Icon name='clone outline'/>
                {UI.INSTANCE_VARIABLES.nb}
              </Header>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Grid.Row>
                <Segment basic>
                  {SSBLogo('30%')}
                </Segment>
              </Grid.Row>
              <Grid.Row>
                <Segment basic>
                  <Dropdown style={{width: "400px"}}
                            selection
                            placeholder={UI.CHOOSE_LDS.nb}
                            options={populateDropdown(LDS_URL)}
                            onChange={(e, data) => this.onChangeLds(e, data)}
                  />
                </Segment>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment basic>
          { error && <Message negative icon='warning' content={error} /> }
          <Input name='id' placeholder={UI.SEARCH_BY_DATARESOURCEID.nb} value={id}
                 onChange={(event, value) => this.handleChange(event, value)}
                 style={{width: "320px"}}/>
          <Button content={UI.SEARCH.nb} onClick={() => this.handleOnClick()}>
          </Button>

          <Input name='datasetid' placeholder={UI.SEARCH_BY_DATASETID.nb} value={datasetid}
                 onChange={(event, value) => this.handleChange(event, value)}
                 style={{width: "320px"}}/>
          <Button content={UI.SEARCH.nb} onClick={() => this.handleOnDataSetSearchClick()}>
          </Button>

        </Segment>
        {ready &&
        <div>
         {/*
          <Segment>
              <IndataTree unitDataSets={result}/>
          </Segment>
         */}
          <Segment>
            <VariableColumnVisibilityTable data={result} lds={lds}/>
          </Segment>
        </div>
        }
      </Segment>
    )
  }
}

export default InstanceVariables
