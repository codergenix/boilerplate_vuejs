import { custom } from 'devextreme/ui/dialog';
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';
import i18n from '../i18n';
export default function saveBeforeExistDialog(isDirty, saveFunction) {
  const getConfirmationPopup = () => custom({
    showTitle: false,
    messageHtml: i18n.global.t('theChangesMadeWillBeLostDoYouWantToSaveThem'),
    buttons: [
      {
        stylingMode: 'contained',
        type: 'default',
        text: i18n.global.t('yes'),
        onClick: () => true,
      }, {
        text: i18n.global.t('no'),
        onClick: () => false,
      }],
  });
  const showDialog = (next) => {
    if (isDirty()) {
      getConfirmationPopup()
        .show()
        .done((dialogResult) => {
          if (dialogResult) {
            saveFunction()
              .then((result) => {
                if (result) {
                  next();
                }
              });
          }
          else {
            next()
          }
        });
    } else {
      next();
    }
  }
  onBeforeRouteUpdate((to, from, next) => {
    showDialog(next);
  });
  onBeforeRouteLeave((to, from, next) => {
    showDialog(next);
  });
}
