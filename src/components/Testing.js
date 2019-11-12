import React, { useEffect, useState } from 'react'
import { request } from 'graphql-request'
import withFixedColumns from 'react-table-hoc-fixed-columns'
import ReactTable from 'react-table'

import { ALL_DESCRIBED_VALUE_DOMAINS, ALL_ENUMERATED_VALUE_DOMAINS } from '../services/graphql/queries/ValueDomain'
import { ALL_POPULATIONS } from '../services/graphql/queries/Population'
import { ALL_REPRESENTED_VARIABLES } from '../services/graphql/queries/RepresentedVariables'
import { getInstanceVariableFromLogicalRecords, mapLdmArray, populateDropdown } from '../utilities/GqlDataConverter'
import { DATASTRUCTURECOMPONENTTYPE, InstanceVariableTable } from '../utilities/Enum'

const ReactTableFixedColumns = withFixedColumns(ReactTable)

function Testing ({ data, lds, language, showColumns }) {
  const [valueLists, setValueLists] = useState([])
  const [instanceVariables, setInstanceVariables] = useState([])
  const [columns, setColumns] = useState([])

  const populateColumns = (tempValueLists, language) => {
    const options = tempValueLists.map(element => element ? populateDropdown(mapLdmArray(element.edges, language)) : [])

    return InstanceVariableTable.map((header, index) => ({
      Header: header[0],
      fixed: index === 0,
      columns: header[1].map(column => ({
        accessor: header[0].charAt(0).toLowerCase() + header[0].slice(1) + column.Header.charAt(0).toUpperCase() + column.Header.slice(1),
        Header: column.Header,
        width: column.width,
        Cell: props => column.input === 'text' ? props.value : '-'
      }))
    }))
  }

  useEffect(() => {
    const graphqlUrl = `${lds.url}/${lds.graphql}`

    Promise.all([
      request(graphqlUrl, ALL_DESCRIBED_VALUE_DOMAINS),
      request(graphqlUrl, ALL_ENUMERATED_VALUE_DOMAINS),
      request(graphqlUrl, ALL_POPULATIONS),
      request(graphqlUrl, ALL_REPRESENTED_VARIABLES)
    ]).then(response => {
      const tempValueLists = [
        { edges: [].concat(response[0].DescribedValueDomain.edges, response[1].EnumeratedValueDomain.edges) },
        response[2].Population,
        response[3].RepresentedVariable,
        DATASTRUCTURECOMPONENTTYPE.DataStructureComponentType
      ]
      setValueLists(tempValueLists)
      setInstanceVariables(getInstanceVariableFromLogicalRecords(data, language))

      setColumns(populateColumns(tempValueLists, language))

    }).catch(console.message)

  }, [data, language, lds.graphql, lds.url])

  return (
    <ReactTableFixedColumns
      className='-highlight'
      sortable
      filterable
      data={instanceVariables}
      columns={columns}
      defaultPageSize={10}
    />
  )
}

export default Testing
