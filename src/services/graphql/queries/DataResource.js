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

