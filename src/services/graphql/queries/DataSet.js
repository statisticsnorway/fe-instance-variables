export const DATASET_WITH_STRUCTURE = `
  query getUnitDataSetById($id: ID!) {
    UnitDataSetById(id: $id) {
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
                      substantiveValueDomain{
                        ... on DescribedValueDomain {
                          id
                          name{languageText}
                        }
                        ... on EnumeratedValueDomain {
                          id
                          name{languageText}
                        }
                      }   
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
export const ALL_DATASETS = `
  query {
    UnitDataSet {
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
