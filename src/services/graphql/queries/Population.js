export const ALL_POPULATIONS = `
  query {
    Population {
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
