import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { LDS_URL } from '../utilities/Enum'
import InstanceVariables from '../components/InstanceVariables'

afterEach(() => {
  cleanup()
})

const setup = () => {
  const props = {
    languageCode: 'nb',
    lds: {
      namespace: 'ns',
      url: 'http://localhost:9090',
      user: 'Test user',
      graphql: 'graphql'
    }
  }
  const {queryAllByTestId, queryAllByText} = render(
    <InstanceVariables {...props} />
  )

  return {queryAllByTestId, queryAllByText}
}

test('InstanceVariables renders correctly', () => {
  const {queryAllByTestId, queryAllByText} = setup()

  expect(queryAllByText('SSB Logo')).toHaveLength(1)
  expect(queryAllByText('Dokumentasjon av variabler')).toHaveLength(1)
  expect(queryAllByTestId('choose-lds')).toHaveLength(1)
  expect(queryAllByTestId('search-dataseteid')).toHaveLength(1)
  expect(queryAllByTestId('search-dataresourceid')).toHaveLength(1)
})

test('ChooseLdsDropdown renders correctly', () => {
  const {queryAllByText} = setup()

  expect(queryAllByText(LDS_URL.stagingLds)).toHaveLength(1)
})



