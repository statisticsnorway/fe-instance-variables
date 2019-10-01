import React, { Component } from 'react'
import { Header, Segment, Grid, Icon, Dropdown, Message, Search } from 'semantic-ui-react'
import _ from 'lodash'
import VariableColumnVisibilityTable from './VariableColumnVisibilityTable'
import { request } from 'graphql-request'
import { DATARESOURCE_WITH_STRUCTURE, ALL_DATARESOURCES } from '../services/graphql/queries/DataResource'
import { DATASET_WITH_STRUCTURE, ALL_DATASETS } from '../services/graphql/queries/DataSet'
import { UI, LDS_URL, MESSAGES } from '../utilities/Enum'
import { SSBLogo } from '../media/Logo'
import { populateDropdownEnum } from '../utilities/common/dropdown'
import {
  getLogicalRecordsFromDataResource,
  getLogicalRecordsFromDataSet,
  mapLdmArray
} from '../utilities/GqlDataConverter'

class InstanceVariables extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoading: false,
      result: [],
      datasetid: props.datasetid,
      allDatasets: [],
      filteredDatasets: [],
      dataresourceid: props.dataresourceid,
      allDataResources: [],
      filteredDataResources: [],
      error: '',
      ready: false,
      lds: props.lds
    }

    this.handleChange = this.handleChange.bind(this)
  }



  componentDidMount () {
    const graphqlUrl = `${this.state.lds.url}/${this.state.lds.graphql}`
    Promise.all([request(graphqlUrl, ALL_DATARESOURCES), request(graphqlUrl, ALL_DATASETS)])
      .then(response => {
        this.setState({
            allDataResources: (response[0] ? mapLdmArray(response[0].DataResource.edges) : []),
            allDatasets: (response[1] ? mapLdmArray(response[1].UnitDataSet.edges) : [])
          }
        )
      }).catch(console.error)
  }


  handleChange = (event, data) => {
    this.setState({[data.name]: data.value})
  }

  handleDatasetSearchChange = (e, { value }) => {
    this.setFilteredArray(value, 'datasetid', 'filteredDatasets', this.state.allDatasets)
  }

  handleDatasetResultSelect = (e, { result }) => {
    this.searchLdmStructure(result.id, DATASET_WITH_STRUCTURE, 'DATASET')
  }

  handleDataResourceSearchChange = (e, { value }) => {
    this.setFilteredArray(value, 'dataresourceid', 'filteredDataResources', this.state.allDataResources)
  }

  handleDataResourceResultSelect = (e, { result }) => {
    this.searchLdmStructure(result.id, DATARESOURCE_WITH_STRUCTURE, 'DATARESOURCE')
  }

  setFilteredArray = (value, idType, filteredType, allDataArray)   => {
    this.setState({ isLoading: true, [idType]: value })

    setTimeout(() => {
      if (value < 1) return this.setState({isLoading: false, result:[], [idType]: ''})

      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = obj =>
        re.test(obj.id) || re.test(obj.name)


      this.setState({
        isLoading: false,
        [filteredType]: _.filter(allDataArray, isMatch),
      })
    }, 300)
  }


  onChangeLds = (e, data) => {
    const graphqlUrl = `${data.value}/${this.state.lds.graphql}`
    Promise.all([request(graphqlUrl, ALL_DATARESOURCES), request(graphqlUrl, ALL_DATASETS)])
      .then(response => {
        this.setState(prevState => ({
            lds: {
              ...prevState.lds,
              url: data.value
            },
            allDataResources: (response[0] ? mapLdmArray(response[0].DataResource.edges) : []),
            allDatasets: (response[1] ? mapLdmArray(response[1].UnitDataSet.edges) : [])
          })
        )
      }).catch(console.error)
  }


  searchLdmStructure = (queryId, query, objectType) => {
    const queryParam = {id: queryId}
    const { lds } = this.state
    const graphqlUrl = `${lds.url}/${lds.graphql}`

    request(graphqlUrl, query, queryParam)
      .then(result => {
        this.setState({
          result: objectType === 'DATASET' ? getLogicalRecordsFromDataSet(result.UnitDataSetById) : getLogicalRecordsFromDataResource(result.DataResourceById),
          ready: true
        }, () => { })
      })
      .catch(error => {
        console.log(error)
        this.setState({result: [], error: error})
      })
  }

  render () {
    const { dataresourceid, datasetid, filteredDataResources, filteredDatasets, result, ready, error, lds, isLoading } = this.state

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
        <Segment.Group horizontal>
          { error && <Message negative icon='warning' content={error} /> }
          <Segment>
            <Header> {UI.SEARCH_BY_DATARESOURCEID.nb}</Header>
            <Search
              loading={isLoading}
              onResultSelect={this.handleDataResourceResultSelect}
              onSearchChange={_.debounce(this.handleDataResourceSearchChange, 500, {
                leading: true,
              })}
              results={filteredDataResources}
              value={dataresourceid}
              fluid={true}
              {...this.props}
            />
          </Segment>
          <Segment>
            <Header> {UI.SEARCH_BY_DATASETID.nb}</Header>
            <Search
              loading={isLoading}
              onResultSelect={this.handleDatasetResultSelect}
              onSearchChange={_.debounce(this.handleDatasetSearchChange, 500, {
                leading: true,
              })}
              results={filteredDatasets}
              value={datasetid}
              fluid={true}
              {...this.props}
            />
        </Segment>
        </Segment.Group>
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
