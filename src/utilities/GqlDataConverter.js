import {LDM_TYPE} from '../utilities/Enum'
export function populateDropdown(dropdownArray) {
  let options = []
  if (dropdownArray) {
    dropdownArray.forEach((element) => {
      let key = element.id
      let text = element.name
      let value = element.id
      options.push(
        {key, text, value})
    })
  } else {console.warn('No dropdowncontent found.')  }
  return options
}


export let mapLdmArray = (ldmArray) => {
  return (ldmArray != null && ldmArray.length > 0) ? ldmArray.map(mapEdge) : []
}

function mapEdge(edge) {
  return {
    id: edge.node.id,
    name: edge.node.name[0].languageText,
    description: (edge.node.description) ? edge.node.description[0].languageText : '',
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

export let getInstanceVariableFromLogicalRecords = (logicalRecords) => {
  let instanceVariables = []
  logicalRecords.forEach((logicalRecord) => {
    let logicalRecordKey = logicalRecord.id
    logicalRecord.instanceVariables.edges.forEach((instanceVariable) => {
      // console.log(instanceVariable)
      let instanceVariableKey = logicalRecordKey + "_" + instanceVariable.node.id
      let instanceVariableId = instanceVariable.node.id
      let instanceVariableName = instanceVariable.node.name[0].languageText
      let instanceVariableDescription = instanceVariable.node.description ?
        instanceVariable.node.description[0].languageText : null
      let instanceVariableShortName = instanceVariable.node.shortName
      let instanceVariableDataStructureComponentType = instanceVariable.node.dataStructureComponentType
      let instanceVariableFormatMask = instanceVariable.node.formatMask
      let population = instanceVariable.node.population.id
      let populationName = instanceVariable.node.population.name[0].languageText
      let sentinelValueDomainName = instanceVariable.node.sentinelValueDomain ?
        instanceVariable.node.sentinelValueDomain.name[0].languageText : null
      let representedVariable = instanceVariable.node.representedVariable ?
        instanceVariable.node.representedVariable.id : null
      let representedVariableName = instanceVariable.node.representedVariable ?
        instanceVariable.node.representedVariable.name[0].languageText : null
      let representedVariableDescription =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.description) ?
        instanceVariable.node.representedVariable.description[0].languageText : null
      let representedVariableUniverse = instanceVariable.node.representedVariable ?
        instanceVariable.node.representedVariable.universe.name[0].languageText : null
      let representedVariableSubstantiveValueDomain =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.substantiveValueDomain)
        ? instanceVariable.node.representedVariable.substantiveValueDomain.name[0].languageText : null
      let representedVariableVariableName =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.variable) ?
          instanceVariable.node.representedVariable.variable.name[0].languageText : null
      let representedVariableVariableDescription =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.variable
        && instanceVariable.node.representedVariable.variable.description) ?
        instanceVariable.node.representedVariable.variable.description[0].languageText : null
      let representedVariableVariableUnitType =
        (instanceVariable.node.representedVariable && instanceVariable.node.representedVariable.variable) ?
          instanceVariable.node.representedVariable.variable.unitType.name[0].languageText : null
      instanceVariables.push({
        instanceVariableKey,
        instanceVariableId,
        instanceVariableName,
        instanceVariableDescription,
        instanceVariableShortName,
        population,
        populationName,
        sentinelValueDomainName,
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