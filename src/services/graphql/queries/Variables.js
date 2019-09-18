export const ALL_VARIABLES = `
  query allVariables  {
    Variable {
      edges {
        node {
          id
          name {languageText}
          description {languageText}
          unitType{name{languageText}}
        }
      }
    }
  }
`