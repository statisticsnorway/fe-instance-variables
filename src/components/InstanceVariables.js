import React, { Component } from 'react'
import { Header, Segment, Grid, Icon, Input, Button, Dropdown, Message, Search } from 'semantic-ui-react'
import _ from 'lodash'
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
  mapLdmArray,
  populateDropdown
} from '../utilities/GqlDataConverter'


class InstanceVariables extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoading: false,
      result: [],
      id: props.id,
      datasetid: '',
      allDatasets: [],
      filteredDatasets: [],
      error: '',
      ready: false,
      lds: props.lds
    }

    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    const { lds } = this.state
    this.getAllDataSets(lds.url).then((result) => this.setState({allDatasets: mapLdmArray(result.UnitDataSet.edges)}))
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

  handleResultSelect = (e, { result }) => {
    console.log(result, 'handleResultSelect')
    this.searchLdmStructure(result.id, DATASET_WITH_STRUCTURE, 'DATASET')
  }

  handleSearchChange = (e, { value }) => {

    this.setState({ isLoading: true, datasetid: value })

    setTimeout(() => {
      if (this.state.datasetid.length < 1) return this.setState({isLoading: false, result:[], datasetid: ''})

      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = obj =>
        re.test(obj.id) || re.test(obj.name)


      this.setState({
        isLoading: false,
        filteredDatasets: _.filter(this.state.allDatasets, isMatch),
      })
    }, 300)
    console.log('ferdig')
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

  onChangeLds = (e, data) => {
    this.getAllDataSets(data.value)
      .then((result) => {
        this.setState(prevState => ({
          lds: {
            ...prevState.lds,
              url:data.value
          },
          allDatasets: mapLdmArray(result.UnitDataSet.edges)
        }))
      })
  }

  onChangeDataset = (e, data) => {
    console.log(data, "hei")
    this.searchLdmStructure(data.value, DATASET_WITH_STRUCTURE, 'DATASET')

  }


  render () {
    const { id, datasetid, allDatasets, filteredDatasets, result, ready, error, lds, isLoading } = this.state

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
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            results={filteredDatasets}
            value={datasetid}
            fluid={true}
            {...this.props}
          />
          <Dropdown style={{width: "400px"}}
                    selection
                    placeholder={UI.CHOOSE_DATASET.nb}
                    options={allDatasets ? populateDropdown(allDatasets) : []}
                    onChange={(e, data) => this.onChangeDataset(e, data)}
          />
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
