import _ from 'lodash'
import CustomStore from 'devextreme/data/custom_store'
const mergeFilters = (loadOptions, filterToAdd) => {
  if (_.isEmpty(filterToAdd)) {
    return loadOptions
  }
  if (_.isEmpty(loadOptions.filter)) {
    loadOptions.filter = filterToAdd
  } else {
    loadOptions.filter = [filterToAdd, 'AND', loadOptions.filter]
  }
  return loadOptions
}
class LookupDataSourceService {
  #store = null
  constructor(store) {
    this.#store = store
  }
  generateLookupDataConfig(params) {
    const parameters = _.assign(
      {
        loadOptions: {
          sort: [{ selector: 'label' }]
        },
        storeAction: null,
        pageSize: 25,
        paginate: true
      },
      params
    )
    return {
      store: new CustomStore({
        useDefaultSearch: true,
        load: (loadOptions) => {
          if (_.isNull(parameters.storeAction)) {
            throw new Error('Invalid store action')
          }
          if (!_.isEmpty(parameters.loadOptions)) {
            if (_.has(parameters.loadOptions, 'filter')) {
              loadOptions = mergeFilters(loadOptions, parameters.loadOptions.filter)
            }
            _.merge(loadOptions, _.omit(parameters.loadOptions, ['filter']))
          }
          return this.#store.dispatch(parameters.storeAction, loadOptions)
          .then((result) => result)
          .catch(() => [])
        },
        byKey: (selectedId) => {
          const loadOptions = {
            filter: ['value', '=', selectedId]
          }
          return this.#store
            .dispatch(parameters.storeAction, loadOptions)
            .then((result) => result.data)
            .catch(() => [])
        }
      }),
      pageSize: parameters.pageSize,
      paginate: parameters.paginate
    }
  }
}
export default LookupDataSourceService
