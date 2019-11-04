export const ALL_POPULATIONS = `
  query {
    Population {
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
