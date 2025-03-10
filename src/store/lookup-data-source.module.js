import RequestService from '@/services/request.service';
// --
const requestService = new RequestService('lookup');
// --
export default {
  namespaced: true,
  actions: {
    LOOKUP_GET_THEMES: (_, loadOptions) => requestService.generatePostRequest('theme-lookup', loadOptions),
    LOOKUP_GET_SUBTHEMES: (_, loadOptions) => requestService.generatePostRequest('subtheme-lookup', loadOptions),
    LOOKUP_GET_CATEGORIES: (_, loadOptions) => requestService.generatePostRequest('category-lookup', loadOptions),
    LOOKUP_GET_LANGUAGES: (_, loadOptions) => requestService.generatePostRequest('language-lookup', loadOptions),
    LOOKUP_GET_CONDITIONS: (_, loadOptions) => requestService.generatePostRequest('condition-lookup', loadOptions),
    LOOKUP_GET_USERS: (_, loadOptions) => requestService.generatePostRequest('user-lookup', loadOptions),
  },
};
