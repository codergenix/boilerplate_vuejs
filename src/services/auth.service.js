import caxios from '@/plugins/caxios'
import { authToken } from '@/services/auth-header'
class AuthService {
  static async login(params) {
    const response = await caxios.post('login', {
      email: params.email,
      password: params.password
    })
    if (response.statusCode && response.statusCode !== 200) {
      throw new Error('Ocorreu um problema a realizar o login')
    }
    if (response.status && response.status !== 200) {
      throw new Error('Ocorreu um problema a realizar o login')
    }
    const responseData = response.data
    if (responseData.status && responseData.status !== 200 && response.data.statusCode !== 200) {
      throw new Error(responseData.detail)
    }
    if (responseData.token) {
      sessionStorage.setItem('webAppUser', JSON.stringify(responseData))
    }
    return responseData
  }
  static async signup(params) {
    const response = await caxios.post('signup', {
      name: params.name,
      email: params.email,
      password: params.password,
      vatNumber: params.vatNumber,
      appEntityRoleId: params.appEntityRoleId
    });
    if (response.statusCode && response.statusCode !== 200) {
      throw new Error('Error during signup');
    }
    if (response.status && response.status !== 200) {
      throw new Error('Error during signup');
    }
    return response.data;
  }
  static async refreshToken() {
    const response = await caxios.post('refresh-token', { jwtToken: authToken() })
    if (response.statusCode && response.statusCode !== 200) {
      throw new Error('Ocorreu um problema a realizar o login')
    }
    if (response.status && response.status !== 200) {
      throw new Error('Ocorreu um problema a realizar o login')
    }
    const responseData = response.data
    if (responseData.jwtToken) {
      const userInfo = JSON.parse(sessionStorage.getItem('webAppUser'))
      userInfo.token = responseData.jwtToken
      userInfo.tokenExpiration = responseData.jwtExpiration
      sessionStorage.setItem('webAppUser', JSON.stringify(userInfo))
    }
    return responseData
  }
  static logout() {
    sessionStorage.removeItem('webAppUser')
  }
}
export default AuthService
