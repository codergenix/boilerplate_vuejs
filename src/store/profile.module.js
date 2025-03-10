import RequestService from '@/services/request.service';
// const requestService = new RequestService('users');
const getRequestService = (resourceType) => {
  return new RequestService(resourceType);
}
const storedUser = JSON.parse(sessionStorage.getItem('webAppUser'))
const defaultState = () => ({
  userInfo: storedUser,
});
export default {
  namespaced: true,
  state: defaultState,
  mutations: {
    resetState(state) {
      Object.assign(state, defaultState());
    },
    userInfo(state, value) {
      state.userInfo = value;
    },
  },
  actions: {
    USER_GET_PROFILE: (_, userId) => getRequestService('user').generateGetRequest(`info/${userId}`),
    USER_CHANGE_PASSWORD: (_, params) => getRequestService('user').generatePutRequest(`change-password/${params.userId}`, params.userInfo),
    USER_UPDATE_PROFILE: (_, params) => getRequestService('user').generatePutRequest(`update/${params.userId}`, params.userInfo),
  },
};
