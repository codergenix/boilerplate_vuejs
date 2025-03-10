const GridToolbarDefaultConfig = {
  visible: true,
  items: [
    {
      cssClass: 'grid-search-panel',
      locateInMenu: 'auto',
      location: 'after',
      name: 'searchPanel',
    }, {
      cssClass: 'grid-add-row-button',
      locateInMenu: 'never',
      location: 'after',
      name: 'addRowButton',
      options: {
        stylingMode: 'contained',
        type: "default",
      },
    }],
};
export default GridToolbarDefaultConfig;
