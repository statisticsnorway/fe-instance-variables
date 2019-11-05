export const DATARESOURCE_WITH_STRUCTURE = `
  query getDataResourceById($id: ID!) {
    DataResourceById(id: $id) {
      id 
      name {languageText, languageCode}
      dataSets {
        edges {
          cursor
          node {
            ... on UnitDataSet {
              id
              name {languageText, languageCode}
              unitDataStructure {
                id
                name {languageText, languageCode}
                logicalRecords {
                  edges {
                    node {
                      id
                      name {languageText, languageCode}
                      description {languageText, languageCode}
                      instanceVariables {
                        edges {
                          node {
                            id
                            name {languageText, languageCode}
                            description {languageText, languageCode}
                            formatMask
                            shortName
                            dataStructureComponentType
                            population{
                              id
                              name {languageText, languageCode}
                              description {languageText, languageCode}
                            }                       
                            representedVariable {
                              id
                              name {languageText, languageCode}
                              description {languageText, languageCode}
                              substantiveValueDomain{
                                ... on DescribedValueDomain {
                                  id
                                  name {languageText, languageCode}
                                }
                                ... on EnumeratedValueDomain {
                                  id
                                  name {languageText, languageCode}
                                }
                              }                              
                              universe {
                                id
                                name {languageText, languageCode}
                              }
                              variable {
                                id
                                name {languageText, languageCode}
                                description {languageText, languageCode}
                                unitType{name{languageText, languageCode}}
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
    }
  }
`

export const ALL_DATARESOURCES = `
  query {
    DataResource {
      edges {
        node {
          id
          name {languageText, languageCode}  
          description{languageText, languageCode}
        }
      }
    }
  }
`

