import {LDM_TYPE} from '../utilities/Enum'
import {getLocalizedGsimObjectText} from './common/GsimLanguageText'

export function populateDropdown(dropdownArray) {
  return dropdownArray.map(element => ({key: element.id, text: element.name, value: element.id}))
}


export let mapLdmArray = (ldmArray, languageCode) => {
  return (ldmArray && ldmArray.length > 0) ? ldmArray.map(edge => mapEdge(edge,languageCode)) : []
}

function mapEdge(edge, languageCode) {
  return {
    id: edge.node.id,
    name: getLocalizedGsimObjectText(edge.node.name, languageCode),
    description: getLocalizedGsimObjectText(edge.node.description, languageCode),
    title: edge.node.id
  }
}

export let getLogicalRecordsFromLdmStructure = (data, ldmObject) => {
  return ldmObject === LDM_TYPE.DATASET ?
    getLogicalRecordsFromDataSet(data.UnitDataSetById) :
    getLogicalRecordsFromDataResource(data.DataResourceById)
}

export let getLogicalRecordsFromDataResource = (dataResource) => {
  let logicalRecords = []
  dataResource.dataSets.edges.forEach((dataSet) =>
    logicalRecords = logicalRecords.concat(getLogicalRecordsFromDataSet(dataSet.node))
  )
  return logicalRecords
}

export let getLogicalRecordsFromDataSet = (dataSet) => {
  let logicalRecords = []
  dataSet.unitDataStructure.logicalRecords.edges.forEach((logRec) =>
    logicalRecords = logicalRecords.concat(logRec.node)
  )
  return logicalRecords
}

export let getInstanceVariableFromLogicalRecords = (logicalRecords, languageCode) => {

  let instanceVariables = []
  logicalRecords.forEach((logicalRecord) => {
    logicalRecord.instanceVariables.edges.forEach((instanceVariable) => {
      let instanceVariableKey = instanceVariable.node.id
      let instanceVariableId = instanceVariable.node.id
      let instanceVariableName = getLocalizedGsimObjectText(instanceVariable.node.name, languageCode)
      let instanceVariableDescription = getLocalizedGsimObjectText(instanceVariable.node.description, languageCode)
      let instanceVariableShortName = instanceVariable.node.shortName
      let instanceVariableDataStructureComponentType = instanceVariable.node.dataStructureComponentType
      let instanceVariableFormatMask = instanceVariable.node.formatMask
      let population = instanceVariable.node.population ? instanceVariable.node.population.id : null
      let sentinelValueDomain = instanceVariable.node.sentinelValueDomain ? instanceVariable.node.sentinelValueDomain.id : null
      let representedVariable = instanceVariable.node.representedVariable ?
        instanceVariable.node.representedVariable.id : null
      let representedVariableName = instanceVariable.node.representedVariable ?
        getLocalizedGsimObjectText(instanceVariable.node.representedVariable.name, languageCode) : null
      let representedVariableDescription =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.description) ?
          getLocalizedGsimObjectText(instanceVariable.node.representedVariable.description, languageCode) : null
      let representedVariableUniverse = instanceVariable.node.representedVariable ?
        getLocalizedGsimObjectText(instanceVariable.node.representedVariable.universe.name, languageCode) : null
      let representedVariableSubstantiveValueDomain =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.substantiveValueDomain) ?
          getLocalizedGsimObjectText(instanceVariable.node.representedVariable.substantiveValueDomain.name, languageCode) : null
      let representedVariableVariableName =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.variable) ?
          getLocalizedGsimObjectText(instanceVariable.node.representedVariable.variable.name, languageCode) : null
      let representedVariableVariableDescription =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.variable
        && instanceVariable.node.representedVariable.variable.description) ?
          getLocalizedGsimObjectText(instanceVariable.node.representedVariable.variable.description, languageCode) : null
      let representedVariableVariableUnitType =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.variable) ?
          getLocalizedGsimObjectText(instanceVariable.node.representedVariable.variable.unitType.name, languageCode) : null
      instanceVariables.push({
        instanceVariableKey,
        instanceVariableId,
        instanceVariableName,
        instanceVariableDescription,
        instanceVariableShortName,
        population,
        // populationName,
        sentinelValueDomain,
        instanceVariableDataStructureComponentType,
        instanceVariableFormatMask,
        representedVariable,
        representedVariableName,
        representedVariableDescription,
        representedVariableUniverse,
        representedVariableSubstantiveValueDomain,
        representedVariableVariableName,
        representedVariableVariableDescription,
        representedVariableVariableUnitType
      })
    })
  })
  return instanceVariables
}


export let getVariableIndex = (variables, key) =>
  variables.findIndex((variable) => {
    return variable.instanceVariableKey === key
  })

export let getValueDomains = (describedValueDomains, enumeratedValueDomains) => {
  let valueDomains = {
      'ValueDomain': {
        'edges': [].concat(describedValueDomains.DescribedValueDomain.edges, enumeratedValueDomains.EnumeratedValueDomain.edges)
      }
  }
  return valueDomains

}