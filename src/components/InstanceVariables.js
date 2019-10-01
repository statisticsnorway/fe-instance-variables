import React, { Component } from 'react'
import { Header, Segment, Grid, Icon, Input, Button, Dropdown, Message } from 'semantic-ui-react'
import VariableColumnVisibilityTable from './VariableColumnVisibilityTable'
import { request } from 'graphql-request'
import { DATARESOURCE_WITH_STRUCTURE } from '../services/graphql/queries/DataResource'
import { UI, LDS_URL, MESSAGES, ICON } from '../utilities/Enum'

import { SSBLogo } from '../media/Logo'
import { populateDropdown } from '../utilities/common/dropdown'

class InstanceVariables extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoading: false,
      result: [],
      id: '',
      message: '',
      messageIcon: '',
      messageColor: '',
      ready: false,
      lds: props.lds
    }

    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (event, data) => {
    this.setState({
      [data.name]: data.value,
      message: '',
      messageIcon: '',
      messageColor: ''
    })
  }

  handleOnClick = () => {
    const queryParam = {id: this.state.id}
    const { lds } = this.state
    const graphqlUrl = `${lds.url}/${lds.graphql}`

    request(graphqlUrl, DATARESOURCE_WITH_STRUCTURE, queryParam)
      .then(dataresource => {
        this.setState({
          result: dataresource.DataResourceById.dataSets.edges,
          ready: true,
          message: '',
          messageIcon: '',
          messageColor: ''}, () => {
        })
      })
      .catch(message => {
        console.log(message)
        this.setState({
          result: [],
          message: MESSAGES.ERROR_IN_SEARCH.nb,
          messageIcon: ICON.ERROR_MESSAGE,
          messageColor: 'red'
        })
      })
  }

  onChangeLds = (e, data) => {
    this.setState(
      prevState => ({
        lds: {
          ...prevState.lds,
          namespace: data.value.includes('localhost') ? 'data' : 'ns',
          url: data.value
        }
      })
    )
  }


  render () {
    const { id, result, ready, message, messageIcon, lds } = this.state

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
                            data-testid='choose-lds'
                  />
                </Segment>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment basic>
          <Segment basic>
            { message && <Message negative icon={messageIcon} content={message} /> }
          </Segment>
          <Input name='id' placeholder={UI.SEARCH_BY_DATARESOURCEID.nb} value={id}
                 onChange={(event, value) => this.handleChange(event, value)}
                 data-testid='dataresourceid'/>
          <Button content={UI.SEARCH.nb} onClick={() => this.handleOnClick()}
                  data-testid='dateresourceidsearch'>
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
