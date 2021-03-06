import React from 'react'
import { cleanup, render } from '@testing-library/react'
import VariableColumnVisibilityTable from '../components/VariableColumnVisibilityTable'
import { UI } from '../utilities/Enum'

afterEach(() => {
  cleanup()
})

const setup = () => {
  const props = {
    result: '',
    lds: {
      namespace: 'ns',
      url: 'http://localhost:9090',
      user: 'Test user',
      graphql: 'graphql'
    }
  }

  const { queryAllByTestId, queryAllByText } = render(
    <VariableColumnVisibilityTable {...props} />
  )

  return { queryAllByTestId, queryAllByText }
}

test('VariableColumnVisibilityTable renders correctly', () => {
  const { queryAllByText } = setup()

  expect(queryAllByText(UI.SHOW_VARIABLES.nb)).toHaveLength(1)
})

test('EditButton renders correctly', () => {
  const { queryAllByTestId } = setup()

  expect(queryAllByTestId('iconEdit')).toHaveLength(1)
})

test('ViewButton does not render initially', () => {
  const { queryAllByTestId } = setup()

  expect(queryAllByTestId('iconView')).toHaveLength(0)
})
