export const DATARESOURCE_WITH_STRUCTURE = `
  query getDataResourceById($id: ID!) {
    DataResourceById(id: $id) {
      id 
      name {languageText}
      dataSets {
        edges {
          cursor
          node {
            ... on UnitDataSet {
              id
              name {languageText}
              unitDataStructure {
                id
                name {languageText}
                logicalRecords {
                  edges {
                    node {
                      id
                      name {languageText}
                      description {languageText}
                      instanceVariables {
                        edges {
                          node {
                            id
                            name {languageText}
                            description {languageText}
                            formatMask
                            shortName
                            dataStructureComponentType
                            population{
                              id
                              name{languageText}
                              description {languageText}
                            }
                            representedVariable {
                              id
                              name {languageText}
                              description {languageText}
                              universe {
                                id
                                name{languageText}
                              }
                              variable {
                                id
                                name {languageText}
                                description {languageText}
                                unitType{name{languageText}}
                              }
                            }
                            reverseMappingRawDataToInputDataTargetInstanceVariable {
                              edges {
                                node {
                                  id
                                  sourceName
                                  sourcePath
                                }
                              }
                            }
                          }
                        }
                      } 
                     reverseRecordRelationshipSourceLogicalRecords {
                       edges {
                         node {
                           id
                         }
                       }
                     }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const ALL_DATARESOURCES = `
  query {
    DataResource {
      edges {
        node {
          id
          name {languageText}  
          description{languageText}
        }
      }
    }
  }
`

export let convertDataToLdmDeleteIds = (data) => {
  console.log(data)

  let dataResourceId = []
  let dataSetIds = []
  let dataStructureIds = []
  let logicalRecordIds = []
  let instanceVariableIds = []
  let mappingRawDataToIndataIds = []
  let recordRelationshipIds = []

  dataResourceId.push("/DataResource/" + data.DataResourceById.id)
  data.DataResourceById.dataSets.edges.forEach((dataSet) => {
    dataSetIds.push("/UnitDataSet/" + dataSet.node.id)
    dataStructureIds.push("/UnitDataStructure/" + dataSet.node.unitDataStructure.id)
    dataSet.node.unitDataStructure.logicalRecords.edges.forEach((logicalRecord) => {
      logicalRecordIds.push("/LogicalRecord/" + logicalRecord.node.id)
      logicalRecord.node.reverseRecordRelationshipSourceLogicalRecords.edges.forEach((reverseRecord) => {
        recordRelationshipIds.push("/RecordRelationship/" + reverseRecord.node.id)
      })
      logicalRecord.node.instanceVariables.edges.forEach((instanceVariable) => {
        instanceVariableIds.push("/InstanceVariable/" + instanceVariable.node.id)
        instanceVariable.node.reverseMappingRawDataToInputDataTargetInstanceVariable.edges.forEach((reverseMapping) => {
          mappingRawDataToIndataIds.push("/MappingRawDataToInputData/" + reverseMapping.node.id)
        })
      })
    })
  })

  return instanceVariableIds
    .concat(mappingRawDataToIndataIds)
    .concat(recordRelationshipIds)
    .concat(logicalRecordIds)
    .concat(dataStructureIds)
    .concat(dataSetIds)
    .concat(dataResourceId)
}

