export const ALL_REPRESENTED_VARIABLES = `
  query allRepresentedVariable  {
    RepresentedVariable {
      edges {
        node {
          id
          name {languageText}
          description {languageText}
          # substantiveValueDomain{__typename}
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