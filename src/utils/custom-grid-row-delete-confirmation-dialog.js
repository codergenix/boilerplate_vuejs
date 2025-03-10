import { custom } from 'devextreme/ui/dialog';
import i18n from '../i18n';
export default function onRowRemoving(e) {
  e.component.option("loadPanel.enabled", false);
  const deleteConfirmationDialog = custom({
    showTitle: false,
    messageHtml: i18n.global.t('areYouSureYouWantToDeleteThisRecord'),
    buttons: [
      {
        stylingMode: 'contained',
        type: 'danger',
        text: i18n.global.t('delete'),
        onClick: () => false,
      }, {
        text: i18n.global.t('cancel'),
        onClick: () => true,
      }],
  });
  e.cancel = deleteConfirmationDialog
    .show()
    .then((dialogResult) => {
      e.component.option("loadPanel.enabled", "auto");
      return dialogResult
    });
}
