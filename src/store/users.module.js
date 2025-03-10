import RequestService from '@/services/request.service';
// ---
const getRequestService = (resourceType) => {
  return new RequestService(resourceType);
}
// ---
export default {
  namespaced: true,
  actions: {
    // -- users
    GET_USERS: (_, loadOptions) => getRequestService('user').generatePostRequest('grid', loadOptions),
    CREATE_USER: (_, postdata) => getRequestService('user').generatePostRequest('create', postdata),
    UPDATE_USER: (_, params) => getRequestService('user').generatePutRequest(`update/${params.userId}`, params.userInfo),
    DELETE_USER: (_, params) => getRequestService('user').generateDeleteRequest(`delete/${params.userId}`),
  },
};
