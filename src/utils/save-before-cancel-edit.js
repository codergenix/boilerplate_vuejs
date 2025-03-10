import { custom } from 'devextreme/ui/dialog';
import i18n from '../i18n';
export default function saveBeforeCancelEdit(isDirty, saveFunction, screenApiRequest, setReadOnly, disableLoading) {
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
  if (isDirty()) {
    getConfirmationPopup().show()
      .done((dialogResult) => {
        if (dialogResult) {
          saveFunction()
            .then((result) => {
              if (result) {
                setReadOnly();
                disableLoading();
                screenApiRequest();
              }
            })
        } else {
          setReadOnly();
          screenApiRequest();
        }
      });
  } else {
    setReadOnly();
  }
}
