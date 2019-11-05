import React, { Component } from 'react'
import { Header, Segment, Grid, Icon, Dropdown, Message, Search } from 'semantic-ui-react'
import _ from 'lodash'
import VariableColumnVisibilityTable from './VariableColumnVisibilityTable'
import { request } from 'graphql-request'
import { UI, LDS_URL, LDM_TYPE, MESSAGES, ICON } from '../utilities/Enum'
import { SSBLogo } from '../media/Logo'
import { populateDropdown } from '../utilities/common/dropdown'
import { LanguageContext, languages} from '../utilities/context/LanguageContext'
import {
  getLogicalRecordsFromLdmStructure,
  mapLdmArray
} from '../utilities/GqlDataConverter'

class InstanceVariables extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoading: false,
      result: [],
      message: '',
      messageIcon: '',
      messageColor: '',
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
    this.setLdsState(this.state.lds.url)
  }

  handleChange = (event, data) => {
    this.setState({
      [data.name]: data.value,
      message: '',
      messageIcon: '',
      messageColor: ''
    })
  }

  handleDatasetSearchChange = (e, {value}) => {
    this.setFilteredArray(value, LDM_TYPE.DATASET, this.state.allDatasets)
  }

  handleDatasetResultSelect = (e, {result}) => {
    this.searchLdmStructure(result.id, LDM_TYPE.DATASET)
  }

  handleDataResourceSearchChange = (e, {value}) => {
    this.setFilteredArray(value, LDM_TYPE.DATARESOURCE, this.state.allDataResources)
  }

  handleDataResourceResultSelect = (e, {result}) => {
    this.searchLdmStructure(result.id, LDM_TYPE.DATARESOURCE)
  }

  setFilteredArray = (value, ldmObject, allDataArray) => {
    this.setState({isLoading: true, [ldmObject.ldmId]: value})

    setTimeout(() => {
      if (value < 1) return this.setState({isLoading: false, result: [], [ldmObject.ldmId]: ''})

      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = obj =>
        re.test(obj.id) || re.test(obj.name)

      this.setState({
        isLoading: false,
        [ldmObject.filteredArray]: _.filter(allDataArray, isMatch),
      })
    }, 300)
  }

  searchLdmStructure = (queryId, ldmObject) => {
    const queryParam = {id: queryId}
    const {lds, languageCode} = this.state
    const graphqlUrl = `${lds.url}/${lds.graphql}`

    request(graphqlUrl, ldmObject.dataStructureQuery, queryParam)
      .then(result => {
        this.setState({
          datasetid: ldmObject === LDM_TYPE.DATASET ? queryId : '',
          dataresourceid: ldmObject === LDM_TYPE.DATARESOURCE ? queryId : '',
          result: getLogicalRecordsFromLdmStructure(result, ldmObject),
          ready: true
        }, () => { })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          result: [],
          allDataResources: [],
          allDatasets: [],
          message: MESSAGES.ERROR[languageCode],
          messageIcon: ICON.ERROR_MESSAGE,
        })
      })
  }

  onChangeLds = (e, data) => {
    this.setLdsState(data.value)
  }

  setLdsState = (ldsUrl) => {
    const {languageCode} = this.state

    const graphqlUrl = `${ldsUrl}/${this.state.lds.graphql}`
    Promise.all([request(graphqlUrl, LDM_TYPE.DATARESOURCE.allDataQuery),
      request(graphqlUrl, LDM_TYPE.DATASET.allDataQuery)])
      .then(response => {
        this.setState(prevState => ({
            lds: {
              ...prevState.lds,
              url: ldsUrl
            },
            allDataResources: (response[0] ? mapLdmArray(response[0].DataResource.edges) : []),
            allDatasets: (response[1] ? mapLdmArray(response[1].UnitDataSet.edges) : []),
            message: '',
            messageIcon: ''
          })
        )
      }).catch(error => {
      console.log(error)
      this.setState(prevState => ({
          lds: {
            ...prevState.lds,
            url: ldsUrl
          },
          message: MESSAGES.ERROR[languageCode],
          messageIcon: ICON.ERROR_MESSAGE,
          allDataResources: [],
          allDatasets: []
        })
      )
    })
  }

  render () {
    const {dataresourceid, datasetid, filteredDataResources, filteredDatasets, result, ready, message, messageIcon, lds, isLoading} = this.state

    let language = this.context.value

    return (
      <Segment basic>
        <Segment basic>
          <Grid columns={2} divided>
            <Grid.Column textAlign='left'>
              <Grid.Row>
                <Header as='h2' icon>
                  <Icon name='clone outline' onClick={() => window.location.reload(false)}/>
                  {UI.INSTANCE_VARIABLES[language]}
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
                  <Dropdown item text={`${UI.LANGUAGE[language]} (${UI.LANGUAGE_CHOICE[language]})`}>
                    <Dropdown.Menu>
                      {Object.keys(languages).map(languageName =>
                        <Dropdown.Item key={languageName} content={UI[languageName][language]}
                                       onClick={() => this.context.setLanguage(languages[languageName].languageCode)} />
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown style={{width: "400px"}}
                            selection
                            placeholder={UI.CHOOSE_LDS.nb}
                            value={lds.url}
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
          {message && <Message negative icon={messageIcon} content={message}/>}
        </Segment>
        <Segment.Group horizontal>
          <Segment>
            <Header> {UI.SEARCH_BY_DATARESOURCEID[language]}</Header>
            <Search
              input={{fluid: true}}
              loading={isLoading}
              onResultSelect={this.handleDataResourceResultSelect}
              onSearchChange={_.debounce(this.handleDataResourceSearchChange, 500, {
                leading: true,
              })}
              results={filteredDataResources}
              value={dataresourceid}
              data-testid='search-dataresourceid'
              noResultsMessage={MESSAGES.NO_RESULT_FOUND[language]}
            />
          </Segment>
          <Segment>
            <Header> {UI.SEARCH_BY_DATASETID[language]}</Header>
            <Search
              input={{fluid: true}}
              loading={isLoading}
              onResultSelect={this.handleDatasetResultSelect}
              onSearchChange={_.debounce(this.handleDatasetSearchChange, 500, {
                leading: true,
              })}
              results={filteredDatasets}
              value={datasetid}
              data-testid='search-dataseteid'
              noResultsMessage={MESSAGES.NO_RESULT_FOUND[language]}
            />
          </Segment>
        </Segment.Group>
        {ready &&
        <div>
          <Segment>
            <VariableColumnVisibilityTable data={result} lds={lds}/>
          </Segment>
        </div>
        }
      </Segment>
    )
  }
}

InstanceVariables.contextType = LanguageContext

export default InstanceVariables
