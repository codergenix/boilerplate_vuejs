<template>
  <dx-popup
    :visible="isPopupVisible"
    :drag-enabled="false"
    :width="550"
    height="auto"
    position="center"
    max-width="92vw"
    max-height="95vh"
    :on-hiding="onClose"
    :wrapper-attr="{ class: 'dx-popup-user-profile' }"
  >
    <div>
      <div class="popup-title-cutom dx-theme-accent-as-text-color">
        {{ $t("profile") }}
      </div>
      <entity-picture
        v-model:imageSource="formData.avatar"
        :container-height="'12rem'"
        :container-width="'12rem'"
        :read-only="false"
        :image-placeholder="formData.name"
      />
      <dx-form
        :element-attr="{ class: 'edit-popup-form' }"
        :form-data="formData"
        :on-initialized="onInitializedFormInstance"
        label-location="left"
        label-mode="static"
        validation-group="user-profile-form-validator"
      >
        <dx-group-item>
          <dx-simple-item
            css-class="custom-padding-top-users-view"
            :label="{ text: $t('name') }"
            :editor-options="{
              placeholder: $t('enterName'),
            }"
            data-field="name"
          >
            <dx-required-rule />
          </dx-simple-item>
          <dx-simple-item
            :col-span="12"
            :editor-options="{
              readOnly: true,
              placeholder: $t('email'),
            }"
            :label="{ text: $t('email') }"
            data-field="email"
          >
            <dx-required-rule />
          </dx-simple-item>
          <dx-simple-item
            css-class="linked-form-field-right"
            :editor-options="{
              placeholder: '0',
              min: 0,
            }"
            :label="{ text: $t('contact') }"
            data-field="contact"
            editor-type="dxNumberBox"
            :validation-rules="[
              {
                type: 'pattern',
                pattern: '^\\d{10,15}$',
                message: 'Enter a valid contact number min 10 or max 15 digits)',
              },
            ]"
          />
        </dx-group-item>
      </dx-form>
    </div>
    <dx-toolbar-item
      widget="dxButton"
      location="after"
      toolbar="bottom"
      :options="{
        stylingMode: 'contained',
        text: $t('save'),
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
import _ from "lodash";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import notification from "@/utils/notification";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import DxForm, { DxSimpleItem, DxGroupItem, DxRequiredRule } from "devextreme-vue/form";
import EntityPicture from "@/components/utils/EntityPicture.vue";
// ----
const { isPopupVisible } = defineProps({
  isPopupVisible: { type: Boolean, default: false },
});
const emit = defineEmits(["update:isPopupVisible"]);
// ----
const store = useStore();
// --
const formInstance = ref(null);
const formData = ref({ mobile: null });
const originalFormData = ref({});
const isLoading = ref(false);
// ---
const onClose = () => {
  formData.value = { mobile: null };
  emit("update:isPopupVisible", false);
};
const onInitializedFormInstance = (e) => {
  formInstance.value = e.component;
};
const saveForm = async () => {
  const validator = formInstance.value.validate();
  if (validator.isValid) {
    if (!_.isEqual(formData.value, originalFormData.value)) {
      return store
        .dispatch("profile/USER_UPDATE_PROFILE", {
          userId: formData.value.userId,
          userInfo: formData.value,
        })
        .then(() => formData)
        .catch((error) => {
          notification.withOptionsAndStack({ message: error });
        });
    } else {
      return true;
    }
  }
  return false;
};
const submitForm = () => {
  saveForm().then((result) => {
    if (!result) return;
    emit("update:isPopupVisible", false);
    const userInfo = JSON.parse(sessionStorage.getItem("webAppUser"));
    userInfo.avatar = formData.value.avatar;
    userInfo.name = formData.value.name;
    sessionStorage.setItem("webAppUser", JSON.stringify(userInfo));
    store.dispatch("auth/UPDATE_USER_FROM_STORAGE", userInfo);
  });
};
const screenApiRequest = () => {
  isLoading.value = true;
  store
    .dispatch("profile/USER_GET_PROFILE", store?.state?.auth?.user.id)
    .then((result) => {
      formData.value = result;
      originalFormData.value = _.cloneDeep(result);
      isLoading.value = false;
    })
    .catch((error) => {
      notification.withOptionsAndStack({ message: error });
      isLoading.value = false;
    });
};
onMounted(() => screenApiRequest());
</script>
<style lang="scss">
.dx-popup-user-profile {
  .dx-popup-title.dx-toolbar .dx-toolbar-items-container {
    height: 35px;
  }
  .dx-popup-content {
    padding-top: 0;
  }
}
</style>
