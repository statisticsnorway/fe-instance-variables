export const ALL_REPRESENTED_VARIABLES = `
  query allRepresentedVariable  {
    RepresentedVariable {
      edges {
        node {
          id
          name {languageText}
          description {languageText}
          substantiveValueDomain{
            ... on DescribedValueDomain {name{languageText}}
            ... on EnumeratedValueDomain {name{languageText}}
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
`