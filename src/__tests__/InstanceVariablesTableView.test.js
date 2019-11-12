import React from 'react'
import { cleanup, render } from '@testing-library/react'
import InstanceVariablesTableView from '../components/InstanceVariablesTableView'
import LogicalRecords from './test-data/LogicalRecordsWithStructure'
import { UI } from '../utilities/Enum'
import { getInstanceVariableFromLogicalRecords } from '../utilities/GqlDataConverter'

afterEach(() => {
  cleanup()
})



const setup = () => {
  const props = {
    data : LogicalRecords,
    showColumns: [
      {name: 'instanceVariableKey', show: false},
      {name: 'instanceVariableName', show: false},
      {name: 'instanceVariableDescription', show: true},
      {name: 'instanceVariableDataStructureComponentType', show: true},
      {name: 'instanceVariableFormatMask', show: true},
      {name: 'population', show: true},
      {name: 'sentinelValueDomain', show: true},
      {name: 'representedVariableName', show: true},
      {name: 'representedVariableDescription', show: true},
      {name: 'representedVariableUniverse', show: true},
      {name: 'representedVariableSubstantiveValueDomain', show: true},
      {name: 'variableName', show: true},
      {name: 'variableDescription', show: true},
      {name: 'variableUnitType', show: true}
    ]
  }

  const { queryAllByTestId, queryAllByText } = render(
    <InstanceVariablesTableView {...props} />
  )
  return { queryAllByTestId, queryAllByText }
}

test('InstanceVariablesTableView renders correctly', () => {
  const { queryAllByText } = setup()

  expect(queryAllByText('Next')).toHaveLength(1)
  expect(queryAllByText('100 rows')).toHaveLength(1)
  expect(queryAllByText('samlet verdi arv eller gave utenfor arbeidsforhold')).toHaveLength(1)
  expect(queryAllByText('Population_DUMMY')).toHaveLength(7)
})


