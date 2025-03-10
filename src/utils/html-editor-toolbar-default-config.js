const HtmlEditorToolbarDefaultConfig = {
  items: [
    { name: 'undo' },
    { name: 'redo' },
    { name: 'separator' },
    { name: 'header', acceptedValues: [false, 1, 2, 3, 4, 5], locateInMenu: 'auto' },
    { name: 'separator' },
    { name: 'bold', locateInMenu: 'auto' },
    { name: 'italic', locateInMenu: 'auto' },
    { name: 'strike', locateInMenu: 'auto' },
    { name: 'underline', locateInMenu: 'auto' },
    { name: 'separator' },
    { name: 'alignLeft', locateInMenu: 'auto' },
    { name: 'alignCenter', locateInMenu: 'auto' },
    { name: 'alignRight', locateInMenu: 'auto' },
    { name: 'alignJustify', locateInMenu: 'auto' },
    { name: 'separator' }
  ],
  multiline: false
};
export default HtmlEditorToolbarDefaultConfig;
