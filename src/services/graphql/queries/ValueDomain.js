export const ALL_SENTINEL_VALUE_DOMAINS = `
  query allSentinelValueDomains {
    ... on DescribedValueDomain {
      id
      name{languageText, languageCode}
      description{languageText, languageCode}
    }
    ... on EnumeratedValueDomain {
      id
      name{languageText, languageCode}
      description{languageText, languageCode}
    }
  }
`

export const ALL_DESCRIBED_VALUE_DOMAINS = ` 
  query allDescribedValueDomains {
    DescribedValueDomain {
      edges {
        node {
          id
          name {languageText, languageCode}
          description {languageText, languageCode}
        }
      }
    }
  }
`

export const ALL_ENUMERATED_VALUE_DOMAINS = ` 
  query allEnumeratedValueDomains {
    EnumeratedValueDomain {
      edges {
        node {
          id
          name {languageText, languageCode}
          description {languageText, languageCode}
        }
      }
    }
  }
`