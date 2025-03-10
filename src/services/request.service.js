import caxios from '@/plugins/caxios'
class RequestService {
  #serviceBaseUrl = null
  constructor(serviceBaseUrl) {
    this.#serviceBaseUrl = serviceBaseUrl
  }
  generatePostRequest(remoteUrl, payload) {
    return caxios
      .post(`${this.#serviceBaseUrl}/${remoteUrl}`, payload)
      .then((response) => {
        const responseData = response.data
        if (!responseData) {
          throw new Error('Invalid response')
        }
        if (responseData.error) {
          throw responseData.message
        }
        return responseData.result
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  }
  generatePutRequest(remoteUrl, payload) {
    return caxios
      .put(`${this.#serviceBaseUrl}/${remoteUrl}`, payload)
      .then((response) => {
        const responseData = response.data
        if (!responseData) {
          throw new Error('Invalid response')
        }
        if (responseData.error) {
          throw responseData.message
        }
        return responseData.result
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  }
  generateDeleteRequest(remoteUrl, payload) {
    return caxios
      .delete(`${this.#serviceBaseUrl}/${remoteUrl}`, payload)
      .then((response) => {
        const responseData = response.data
        if (!responseData) {
          throw new Error('Invalid response')
        }
        if (responseData.error) {
          throw responseData.message
        }
        return responseData.result
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  }
  generateGetRequest(remoteUrl) {
    return caxios
      .get(`${this.#serviceBaseUrl}/${remoteUrl}`)
      .then((response) => {
        const responseData = response.data
        if (!responseData) {
          throw new Error('Invalid response')
        }
        if (responseData.error) {
          throw responseData.message
        }
        return responseData.result
      })
      .catch((error) => {
        console.error(error)
        throw error
      })
  }
  generateDownloadRequest(remoteUrl) {
    return caxios
      .get(`${this.#serviceBaseUrl}/${remoteUrl}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error)
        throw error
      })
  }
}
export default RequestService
