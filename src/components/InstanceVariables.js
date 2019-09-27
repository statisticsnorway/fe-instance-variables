import React, { Component } from 'react'
import { Header, Segment, Grid, Icon, Input, Button, Dropdown, Message } from 'semantic-ui-react'
import VariableColumnVisibilityTable from './VariableColumnVisibilityTable'
import { request } from 'graphql-request'
import { DATARESOURCE_WITH_STRUCTURE } from '../services/graphql/queries/DataResource'
import { DATASET_WITH_STRUCTURE, ALL_DATASETS } from '../services/graphql/queries/DataSet'
import { UI, LDS_URL, MESSAGES } from '../utilities/Enum'
import { SSBLogo } from '../media/Logo'
import { populateDropdownEnum } from '../utilities/common/dropdown'
import {
  getLogicalRecordsFromDataResource,
  getLogicalRecordsFromDataSet,
  mapLdmDropdownArray,
  populateDropdown
} from '../utilities/GqlDataConverter'


class InstanceVariables extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoading: false,
      result: [],
      id: '',
      datasetid: '',
      datasets: null,
      error: '',
      ready: false,
      lds: props.lds
    }

    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    const { lds } = this.state
    this.getAllDataSets(lds.url).then((result) => this.setState({datasets: result}))
  }

  getAllDataSets = (url) => {
    return new Promise( (resolve) => {
      const graphqlUrl = `${url}/${this.state.lds.graphql}`
      request(graphqlUrl, ALL_DATASETS)
        .then(response => {
          console.log(response, 'response all_datasets')
          resolve(response)
        }).catch(console.error)
    })
  }


  handleChange = (event, data) => {
    this.setState({[data.name]: data.value})
  }

  handleOnClick = () => {
    this.searchLdmStructure(this.state.id, DATARESOURCE_WITH_STRUCTURE, 'DATARESOURCE')
  }

  handleOnDataSetSearchClick = () => {
    this.searchLdmStructure(this.state.datasetid, DATASET_WITH_STRUCTURE, 'DATASET')
  }

  searchLdmStructure = (queryId, query, objectType) => {
    const queryParam = {id: queryId}
    const { lds } = this.state
    const graphqlUrl = `${lds.url}/${lds.graphql}`

    request(graphqlUrl, query, queryParam)
      .then(result => {
        this.setState({
          result: objectType == 'DATASET' ? getLogicalRecordsFromDataSet(result.UnitDataSetById) : getLogicalRecordsFromDataResource(result.DataResourceById),
          ready: true
        }, () => { })
      })
      .catch(error => {
        console.log(error)
        this.setState({result: [], error: error})
      })
  }

  onChangeLds = (e, data) => {
    this.getAllDataSets(data.value)
      .then((result) => {
        this.setState(prevState => ({
          lds: {
            ...prevState.lds,
              url:data.value
          },
          datasets: result
        }))
      })
  }

  onChangeDataset = (e, data) => {
    console.log(data, "hei")
    this.searchLdmStructure(data.value, DATASET_WITH_STRUCTURE, 'DATASET')

  }


  render () {
    const { id, datasetid, datasets, result, ready, error, lds } = this.state

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
                            options={populateDropdownEnum(LDS_URL)}
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
          <Button content={UI.SEARCH.nb} onClick={() => this.handleOnClick()}/>

          <Input name='datasetid' placeholder={UI.SEARCH_BY_DATASETID.nb} value={datasetid}
                 onChange={(event, value) => this.handleChange(event, value)}
                 style={{width: "320px"}}/>
          <Button content={UI.SEARCH.nb} onClick={() => this.handleOnDataSetSearchClick()} />
          <Dropdown style={{width: "400px"}}
                    selection
                    placeholder={UI.CHOOSE_DATASET.nb}
                    options={datasets ? (populateDropdown(mapLdmDropdownArray(datasets.UnitDataSet.edges))) : []}
                    onChange={(e, data) => this.onChangeDataset(e, data)}
          />}
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
