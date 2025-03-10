<template>
  <dx-popup
    :visible="isPopupVisible"
    :drag-enabled="false"
    :show-title="true"
    :width="450"
    height="auto"
    max-width="100%"
    :title="$t('changePassword')"
    :wrapper-attr="{ class: 'change-password-popup' }"
    :on-hiding="onClose"
  >
    <dx-form
      :element-attr="{ class: 'edit-popup-form' }"
      :form-data="formData"
      :on-initialized="onInitializedFormInstance"
      label-location="left"
      label-mode="static"
      validation-group="change-password-validator"
    >
      <dx-simple-item
        :label="{ text: $t('oldPassword') }"
        data-field="oldPassword"
        :editor-options="editorOptionsOldPassword"
      >
        <dx-required-rule />
      </dx-simple-item>
      <dx-simple-item
        :label="{ text: $t('newPassword') }"
        data-field="newPassword"
        :editor-options="editorOptionsNEWPassword"
      >
        <dx-required-rule />
        <dx-pattern-rule :pattern="pattern.lower" :message="$t('passwordLower')" />
        <dx-pattern-rule :pattern="pattern.upper" :message="$t('passwordUpper')" />
        <dx-pattern-rule :pattern="pattern.numeric" :message="$t('passwordNumeric')" />
        <dx-pattern-rule :pattern="pattern.special" :message="$t('passwordSpecial')" />
        <dx-string-length-rule :min="9" :max="32" :message="$t('passwordLength')" />
      </dx-simple-item>
      <dx-simple-item
        :label="{ text: $t('passwordConfirmation') }"
        data-field="passwordConfirmation"
        :editor-options="editorOptionsConfirmPassword"
      >
        <dx-required-rule />
        <dx-compare-rule
          :comparison-target="passwordComparison"
          :message="$t('passwordMismatch')"
        />
      </dx-simple-item>
    </dx-form>
    <dx-toolbar-item
      widget="dxButton"
      location="after"
      toolbar="bottom"
      :options="{
        stylingMode: 'contained',
        text: $t('confirm'),
        onClick: submitForm,
      }"
    />
    <dx-toolbar-item
      widget="dxButton"
      location="after"
      toolbar="bottom"
      :options="{
        text: $t('cancel'),
        onClick: onClose,
      }"
    />
  </dx-popup>
</template>
<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import notification from "@/utils/notification";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import DxForm, {
  DxSimpleItem,
  DxRequiredRule,
  DxStringLengthRule,
  DxCompareRule,
  DxPatternRule,
} from "devextreme-vue/form";
// -----
const { isPopupVisible } = defineProps({
  isPopupVisible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:isPopupVisible"]);
// -----
const store = useStore();
// --
const formInstance = ref(null);
const formData = ref({});
const hidePassword = ref({ old: true, new: true, confirm: true });
// ---
const editorOptionsOldPassword = computed(() => ({
  mode: hidePassword.value.old ? "password" : "text",
  buttons: [
    {
      location: "after",
      name: "password",
      options: {
        elementAttr: {
          class: "show-hide-icon",
        },
        stylingMode: "text",
        type: "normal",
        template: `<span class="material-symbols-rounded">${
          hidePassword.value.old ? "visibility" : "visibility_off"
        }</span>`,
        onClick: () => {
          hidePassword.value.old = !hidePassword.value.old;
        },
      },
    },
  ],
}));
const editorOptionsNEWPassword = computed(() => ({
  mode: hidePassword.value.new ? "password" : "text",
  buttons: [
    {
      location: "after",
      name: "password",
      options: {
        elementAttr: {
          class: "show-hide-icon",
        },
        stylingMode: "text",
        type: "normal",
        template: `<span class="material-symbols-rounded">${
          hidePassword.value.new ? "visibility" : "visibility_off"
        }</span>`,
        onClick: () => {
          hidePassword.value.new = !hidePassword.value.new;
        },
      },
    },
  ],
}));
const editorOptionsConfirmPassword = computed(() => ({
  mode: hidePassword.value.confirm ? "password" : "text",
  buttons: [
    {
      location: "after",
      name: "password",
      options: {
        elementAttr: {
          class: "show-hide-icon",
        },
        stylingMode: "text",
        type: "normal",
        template: `<span class="material-symbols-rounded">${
          hidePassword.value.confirm ? "visibility" : "visibility_off"
        }</span>`,
        onClick: () => {
          hidePassword.value.confirm = !hidePassword.value.confirm;
        },
      },
    },
  ],
}));
// ---
const onInitializedFormInstance = (e) => {
  formInstance.value = e.component;
};
const onClose = () => {
  formData.value = {};
  emit("update:isPopupVisible", false);
};
const saveForm = async () => {
  const validator = formInstance.value.validate();
  if (validator.isValid) {
    return store
      .dispatch("profile/USER_CHANGE_PASSWORD", {
        userId: store?.state?.auth?.user.id,
        userInfo: formData.value,
      })
      .then((result) => result)
      .catch((error) => {
        notification.withOptionsAndStack({ message: error });
      });
  }
  return false;
};
const submitForm = () => {
  saveForm().then((result) => {
    if (!result) return;
    emit("update:isPopupVisible", false);
  });
};
const passwordComparison = () => formData.value.newPassword;
// ---
const pattern = {
  lower: "^(?=.*[a-z]).*$",
  upper: "^(?=.*[A-Z]).*$",
  numeric: "^(?=.*[0-9]).*$",
  special: "^(?=.*[*.!@#$%^&(){}[\\]:;'<>,.?/~`_+\\-=|\\\\]).*$",
};
</script>
