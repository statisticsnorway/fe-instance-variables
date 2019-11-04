import axios from 'axios'

const credentials = process.env.NODE_ENV === 'production' ? 'include' : 'same-origin'
const headers = { 'Content-Type': 'application/json; charset=utf-8' }

export const get = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      credentials: credentials,
      method: 'GET',
      headers: headers
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        response.json().then(json => resolve(json))
      } else {
        response.text().then(text => reject(text))
      }
    }).catch(error => reject(`${error} (${url})`))
  })
}

export const post = (url, body) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      credentials: credentials,
      method: 'POST',
      headers: headers,
      body: body
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        response.json().then(json => resolve(json))
      } else if (response.status === 404) {
        // TODO need to handle?
      } else {
        response.text().then(text => reject(text))
      }
    }).catch(error => reject(`${error} (${url})`))
  })
}

export const put = (url, body) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      credentials: credentials,
      method: 'PUT',
      headers: headers,
      body: body
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        response.json().then(json => resolve(json))
      } else if (response.status === 404) {
        // TODO need to handle?
      } else {
        response.text().then(text => reject(text))
      }
    }).catch(error => reject(`${error} (${url})`))
  })
}

export function dataDeleteAxios (url) {
  return new Promise((resolve, reject) => {
    console.log('dataFetcher - url: ' + url)
    axios.delete(url)
      .then(response => {
        resolve(response)
      }).catch((error) => {
      reject(error)
    })
  })
}