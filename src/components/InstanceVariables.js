import React, { Component } from 'react'
import { Header, Segment, Input, Button, Grid, Icon } from 'semantic-ui-react'
import VariableColumnVisibilityTable from './VariableColumnVisibilityTable'
import { request } from 'graphql-request'
import { DATARESOURCE_WITH_STRUCTURE } from '../services/graphql/queries/DataResource'
import { UI } from '../utilities/Enum'
import { SSBLogo } from '../media/Logo'

const  graphqlUrl = 'http://localhost:9090/graphql'

class InstanceVariables extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoading: false,
      theResults: [],
      id: '',
      theError: '',
      ready: false
    }

    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (event, data) => {
    this.setState({[data.name]: data.value})
  }

  handleOnClick = () => {
    const queryParam = {id: this.state.id}

    request(graphqlUrl, DATARESOURCE_WITH_STRUCTURE, queryParam)
      .then(dataresource => {
        this.setState({theResults: dataresource.DataResourceById.dataSets.edges, ready: true}, () => {
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({theResults: [], theError: error})
      })
  }

  render () {
    const {id, theResults, ready} = this.state
    return (
      <Segment basic>
        <Segment basic>
          <Grid columns={2} divided>
            <Grid.Row>
              <Grid.Column textAlign='left'>
                <Header as='h1' icon>
                  <Icon name='clone outline'/>
                  {UI.INSTANCE_VARIABLES.nb}
                </Header>
              </Grid.Column>
              <Grid.Column textAlign='right'>
                {SSBLogo('30%')}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment basic>
          <Input type="text" name='id' placeholder={UI.SEARCH_BY_DATARESOURCEID.nb} value={id}
                 onChange={(event, value) => this.handleChange(event, value)}
                 style={{width: "320px"}}/>
          <Button content={UI.SEARCH.nb} onClick={() => this.handleOnClick()}>
          </Button>
        </Segment>
        {ready &&
        <div>
         {/*
          <Segment>
              <IndataTree unitDataSets={theResults}/>
          </Segment>
         */}
          <Segment>
            <VariableColumnVisibilityTable data={theResults}/>
          </Segment>
        </div>
        }
      </Segment>
    )
  }
}

export default InstanceVariables
