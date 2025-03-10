export const authToken = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('webAppUser'))
  if (userInfo && userInfo.token) {
    return userInfo.token
  }
  return null
}
export default function authHeader() {
  const token = authToken()
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}
