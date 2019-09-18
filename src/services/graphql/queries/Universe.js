export const ALL_UNIVERSES = `
  query {
    Universe {
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
