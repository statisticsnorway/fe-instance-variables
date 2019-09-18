export const FULL_TEXT_SEARCH = `
  query textSearch($text: String!) {
    Search(query: $text) {
      edges {
        node {
          __typename
          ... on UnitDataSet {
            id
            name { languageText }
            description { languageText }
          }
          ... on DimensionalDataSet {
            id
            name { languageText }
            description { languageText }
          }
          ... on Variable {
            id
            name { languageText }
            description { languageText }
          }
        }
      }
    }
  }
`

