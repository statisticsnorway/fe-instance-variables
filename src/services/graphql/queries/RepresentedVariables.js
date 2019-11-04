export const ALL_REPRESENTED_VARIABLES = `
  query allRepresentedVariable  {
    RepresentedVariable {
      edges {
        node {
          id
          name {languageText, languageCode}
          description {languageText, languageCode}
          substantiveValueDomain{
            ... on DescribedValueDomain {name{languageText, languageCode}}
            ... on EnumeratedValueDomain {name{languageText, languageCode}}
          }
          universe {
            id
            name{languageText, languageCode}
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
`