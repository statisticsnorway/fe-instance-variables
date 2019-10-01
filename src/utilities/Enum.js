export const LANGUAGES = {
  norwegian: {
    flag: 'no',
    languageCode: 'nb'
  },
  english: {
    flag: 'gb',
    languageCode: 'en'
  }
}

export const LDS_URL = {
  local:  'http://localhost:9090',
  stagingLds: 'https://lds-client.staging.ssbmod.net/be/lds',
  stagingLdsB: 'https://lds-client.staging.ssbmod.net/be/lds-b',
  stagingLdsC: 'https://lds-client.staging.ssbmod.net/be/lds-c'
}

export const DATASTRUCTURECOMPONENTTYPE = {
  "DataStructureComponentType": {
    "edges": [
      {
        "node": {
          "id": "MEASURE",
          "name": [
            {
              "languageText": "MEASURE"
            }
          ],
          "description": [
            {
              "languageText": "MEASURE"
            }
          ]
        }
      },
      {
        "node": {
          "id": "ATTRIBUTE",
          "name": [
            {
              "languageText": "ATTRIBUTE"
            }
          ],
          "description": [
            {
              "languageText": "ATTRIBUTE"
            }
          ]
        }
      },
      {
        "node": {
          "id": "IDENTIFIER",
          "name": [
            {
              "languageText": "IDENTIFIER"
            }
          ],
          "description": [
            {
              "languageText": "IDENTIFIER"
            }
          ]
        }
      }
    ]
  }
}

export const MESSAGES = {
  ERROR: {
    en: 'Error',
    nb: 'Noe feilet'
  },
  ERROR_IN_SEARCH: {
    en: 'Error in search.',
    nb: 'Noe feiler i søket.'
  },
  INVALID_FORMAT: {
    en: 'Invalid file format',
    nb: 'Ugyldig filformat'
  },
  INVALID_JSON: {
    en: 'Invalid JSON',
    nb: 'Ugyldig JSON'
  },
  MISSING_ID: {
    en: 'Object is missing an id',
    nb: 'Objektet mangler id'
  },
  SORRY: {
    en: 'Sorry :\'(',
    nb: 'Beklager :\'('
  },
  PAGE_NOT_FOUND: {
    en: 'Could not find anything located at',
    nb: 'Fant desverre ingenting under'
  },
  PROPERTY_ERROR_CASE: {
    en: 'A property starts with uppercase',
    nb: 'Et objektelement starter med stor bokstav'
  },
  SAVE_SUCCESSFUL: {
    en: 'Save to LDS was is completed',
    nb: 'Lagring til LDS gjennomført'
  }
}

export const UI = {
  ENGLISH: {
    en: 'English',
    nb: 'Engelsk'
  },
  NORWEGIAN: {
    en: 'Norwegian',
    nb: 'Norsk'
  },
  LANGUAGE: {
    en: 'Language',
    nb: 'Språk'
  },
  LANGUAGE_CHOICE: {
    en: 'English',
    nb: 'Norsk'
  },
  INSTANCE_VARIABLES: {
    en: 'Instance variables',
    nb: 'Instansvariabler'
  },
  SEARCH: {
    en: 'Search',
    nb: 'Søk'
  },
  SHOW_VARIABLES: {
    en: 'Show variables',
    nb: 'Vis variable'
  },
  SEARCH_BY_DATARESOURCEID: {
    en: 'Dataresourceid...',
    nb: 'Dataresourceid...'
  },
  SEARCH_BY_DATASETID: {
    en: 'Datasetid...',
    nb: 'Datasettid...'
  },
  CHOOSE_DATASET: {
    en: 'Choose dataSet...',
    nb: 'Velg datasett...'
  },
  CHOOSE_LDS: {
    en: 'Choose lds...',
    nb: 'Velg lds...'
  }

}

export const GSIM = {
  INSTANCE_VARIABLE: 'InstanceVariable'
}

export const ICON = {
  INFO_MESSAGE: 'check circle',
  ERROR_MESSAGE: 'times circle outline',
  EDIT: 'edit',
  VIEW: 'edit outline'
}

