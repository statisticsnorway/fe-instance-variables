import { cleanup } from "@testing-library/react"
import UnitDatasets from '../test-data/AllDatasets'
import DatasetWithStructure from '../test-data/DatasetWithStructure'
import DataResourceWithStructure from '../test-data/DataResourceWithStructure'
import LogicalRecordsWithStructure from '../test-data/LogicalRecordsWithStructure'
import LogicalRecordWithSingleInstanceVariable from '../test-data/LogicalRecordWithSingleInstanceVariable'
import LogicalRecordWithSingleInstanceVariableNoRepresentedVariable from '../test-data/LogicalRecordWithSingleInstanceVariableNoRepresentedVariable'
import LogicalRecordWithSingleInstanceVariableNoVariable from '../test-data/LogicalRecordWithSingleInstanceVariableNoVariable'
import {mapLdmArray,
  populateDropdown,
  getLogicalRecordsFromDataSet,
  getLogicalRecordsFromDataResource,
  getInstanceVariableFromLogicalRecords,
  getLogicalRecordsFromLdmStructure} from '../../utilities/GqlDataConverter'
import {LDM_TYPE} from '../../utilities/Enum'

let unitDataArray
beforeAll( () => {
  unitDataArray = UnitDatasets.data.UnitDataSet.edges;
})

afterEach(() => {
  cleanup()
})

describe('Test GqlDataConverter functions', () => {

  test('Test mapLdmArray for datasets has two entries', () => {
    expect(mapLdmArray(unitDataArray).length).toBe(2)
  })

  test('Test mapLdmArray for datasets has one entry with name "FamilyDataset"', () => {
    expect(mapLdmArray(unitDataArray)[0].name).not.toBe('FamilyDataset')
    expect(mapLdmArray(unitDataArray)[1].name).toBe('FamilyDataset')
  })

  test('Test mapLdmArray for datasets has one entry with given values', () => {
    expect(mapLdmArray(unitDataArray)[0].name).toBe('PersonWithIncomeDataset')
    expect(mapLdmArray(unitDataArray)[0].id).toBe('b9c10b86-5867-4270-b56e-ee7439fe381e')
    expect(mapLdmArray(unitDataArray)[0].description).toBe('Persons with income in Norway per 2018-01-01')
    expect(mapLdmArray(unitDataArray)[0].title).toBe('b9c10b86-5867-4270-b56e-ee7439fe381e')
  })


  test('Test populateDropdown has two options for datasets and one has given values', () => {
    let ddArray = mapLdmArray(unitDataArray)
    let dropdownOptions = populateDropdown(ddArray)
    expect(dropdownOptions.length).toBe(2)
    expect(dropdownOptions.filter(option => option['key'] === 'd7f1a566-b906-4561-92cb-4758b766335c').length).toBe(1)
    expect(dropdownOptions.filter(option => option['text'] === 'FamilyDataset').length).toBe(1)
    expect(dropdownOptions.filter(option => option['value'] === 'd7f1a566-b906-4561-92cb-4758b766335c').length).toBe(1)
  })

  test('Test null or empty dropdownArray gives empty options', () => {
    console.warn = jest.fn()
    let dropdownOptions = populateDropdown()
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(dropdownOptions.length).toBe(0)
    dropdownOptions = populateDropdown([])
    expect(dropdownOptions.length).toBe(0)
  })


  test.skip('Test getLogicalRecordsFromLdmStructure calls right method and returns correct number of logical records', () => {
    // getLogicalRecordsFromDataResource = jest.fn()
    // getLogicalRecordsFromDataSet = jest.fn()
    let logRecs = getLogicalRecordsFromLdmStructure(DataResourceWithStructure.data, LDM_TYPE.DATARESOURCE)
    // expect(getLogicalRecordsFromDataResource).toHaveBeenCalledTimes(1)
    // expect(getLogicalRecordsFromDataSet).toHaveBeenCalledTimes(0)
    expect(logRecs.length).toBe(5)
    logRecs = getLogicalRecordsFromLdmStructure(DatasetWithStructure.data, LDM_TYPE.DATASET)
    // expect(getLogicalRecordsFromDataResource).toHaveBeenCalledTimes(1)
    // expect(getLogicalRecordsFromDataSet).toHaveBeenCalledTimes(0)
    expect(logRecs.length).toBe(1)

  })

  test('Test getLogicalRecordsFromDataResource returns five logical records from dataresource', () => {
    console.log(DataResourceWithStructure.data.DataResourceById)
    expect(getLogicalRecordsFromDataResource(DataResourceWithStructure.data.DataResourceById).length).toBe(5)
  })

  test('Test getLogicalRecordsFromDataSet returns one logical record from dataset', () => {
    console.log(DatasetWithStructure.data.UnitDataSetById)
    expect(getLogicalRecordsFromDataSet(DatasetWithStructure.data.UnitDataSetById).length).toBe(1)
  })

  test('Test getInstanceVariableFromLogicalRecords returns three instance variables from logical record', () => {
    console.log(LogicalRecordsWithStructure)
    expect(getInstanceVariableFromLogicalRecords(LogicalRecordsWithStructure).length).toBe(7)
  })

  test('Test getInstanceVariableFromLogicalRecords returns instancevariable with correct values', () => {
    let instanceVariable = getInstanceVariableFromLogicalRecords(LogicalRecordWithSingleInstanceVariable)[0]
    expect(instanceVariable.instanceVariableName).toBe('samletVerdiArvEllerGaveUtenforArbeidsforhold')
    expect(instanceVariable.instanceVariableKey).toBe('00421599-d50f-4c34-9ce1-261aa5483c3c_67e2de76-5bb5-465f-a6b0-76522661009e')
    expect(instanceVariable.instanceVariableId).toBe('67e2de76-5bb5-465f-a6b0-76522661009e')
    expect(instanceVariable.instanceVariableName).toBe('samletVerdiArvEllerGaveUtenforArbeidsforhold')
    expect(instanceVariable.instanceVariableDescription).toBe('samlet verdi arv eller gave utenfor arbeidsforhold')
    expect(instanceVariable.instanceVariableShortName).toBe('samletVerdiArvEllerGaveUtenforArbeidsforhold')
    expect(instanceVariable.population).toBe('Population_DUMMY')
    expect(instanceVariable.populationName).toBe('Population_DUMMY')
    expect(instanceVariable.sentinelValueDomainName).toBeNull()
    expect(instanceVariable.instanceVariableDataStructureComponentType).toBe('MEASURE')
    expect(instanceVariable.instanceVariableFormatMask).toBe(undefined)
    expect(instanceVariable.representedVariable).toBe('RepresentertVariable_DUMMY')
    expect(instanceVariable.representedVariableName).toBe('RepresentertVariable_DUMMY')
    expect(instanceVariable.representedVariableDescription).toBe('dummy presisisert variabel')
    expect(instanceVariable.representedVariableUniverse).toBe('Universe_DUMMY')
    expect(instanceVariable.representedVariableSubstantiveValueDomain).toBeNull()
    expect(instanceVariable.representedVariableVariableName).toBe('Variable_DUMMY')
    expect(instanceVariable.representedVariableVariableDescription).toBeNull()
    expect(instanceVariable.representedVariableVariableUnitType).toBe('UnitType_DUMMY')
  })

  test('Test getInstanceVariableFromLogicalRecords returns instancevariable with no variable', () => {
    let instanceVariable = getInstanceVariableFromLogicalRecords(LogicalRecordWithSingleInstanceVariableNoVariable)[0]
    expect(instanceVariable.instanceVariableName).toBe('samletVerdiArvEllerGaveUtenforArbeidsforhold')
    expect(instanceVariable.instanceVariableKey).toBe('00421599-d50f-4c34-9ce1-261aa5483c3c_67e2de76-5bb5-465f-a6b0-76522661009e')
    expect(instanceVariable.instanceVariableId).toBe('67e2de76-5bb5-465f-a6b0-76522661009e')
    expect(instanceVariable.instanceVariableName).toBe('samletVerdiArvEllerGaveUtenforArbeidsforhold')
    expect(instanceVariable.instanceVariableDescription).toBe('samlet verdi arv eller gave utenfor arbeidsforhold')
    expect(instanceVariable.instanceVariableShortName).toBe('samletVerdiArvEllerGaveUtenforArbeidsforhold')
    expect(instanceVariable.population).toBe('Population_DUMMY')
    expect(instanceVariable.populationName).toBe('Population_DUMMY')
    expect(instanceVariable.sentinelValueDomainName).toBeNull()
    expect(instanceVariable.instanceVariableDataStructureComponentType).toBe('MEASURE')
    expect(instanceVariable.instanceVariableFormatMask).toBe(undefined)
    expect(instanceVariable.representedVariable).toBe('RepresentertVariable_DUMMY')
    expect(instanceVariable.representedVariableName).toBe('RepresentertVariable_DUMMY')
    expect(instanceVariable.representedVariableDescription).toBe('dummy presisisert variabel')
    expect(instanceVariable.representedVariableUniverse).toBe('Universe_DUMMY')
    expect(instanceVariable.representedVariableSubstantiveValueDomain).toBeNull()
    expect(instanceVariable.representedVariableVariableName).toBeNull()
    expect(instanceVariable.representedVariableVariableDescription).toBeNull()
    expect(instanceVariable.representedVariableVariableUnitType).toBeNull()
  })

  test('Test getInstanceVariableFromLogicalRecords returns correct instancevariable with no represented variable', () => {
    let instanceVariable = getInstanceVariableFromLogicalRecords(LogicalRecordWithSingleInstanceVariableNoRepresentedVariable)[0]
    expect(instanceVariable.instanceVariableName).toBe('samletVerdiArvEllerGaveUtenforArbeidsforhold')
    expect(instanceVariable.instanceVariableKey).toBe('00421599-d50f-4c34-9ce1-261aa5483c3c_67e2de76-5bb5-465f-a6b0-76522661009e')
    expect(instanceVariable.instanceVariableId).toBe('67e2de76-5bb5-465f-a6b0-76522661009e')
    expect(instanceVariable.instanceVariableName).toBe('samletVerdiArvEllerGaveUtenforArbeidsforhold')
    expect(instanceVariable.instanceVariableDescription).toBe('samlet verdi arv eller gave utenfor arbeidsforhold')
    expect(instanceVariable.instanceVariableShortName).toBe('samletVerdiArvEllerGaveUtenforArbeidsforhold')
    expect(instanceVariable.population).toBe('Population_DUMMY')
    expect(instanceVariable.populationName).toBe('Population_DUMMY')
    expect(instanceVariable.sentinelValueDomainName).toBeNull()
    expect(instanceVariable.instanceVariableDataStructureComponentType).toBe('MEASURE')
    expect(instanceVariable.instanceVariableFormatMask).toBe(undefined)
    expect(instanceVariable.representedVariable).toBeNull()
    expect(instanceVariable.representedVariableName).toBeNull()
    expect(instanceVariable.representedVariableDescription).toBeNull()
    expect(instanceVariable.representedVariableUniverse).toBeNull()
    expect(instanceVariable.representedVariableSubstantiveValueDomain).toBeNull()
    expect(instanceVariable.representedVariableVariableName).toBeNull()
    expect(instanceVariable.representedVariableVariableDescription).toBeNull()
    expect(instanceVariable.representedVariableVariableUnitType).toBeNull()
  })


})


