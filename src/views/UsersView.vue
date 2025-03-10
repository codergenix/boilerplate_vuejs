<template>
  <main>
    <dx-data-grid
      height="90vh"
      :column-auto-width="true"
      :data-source="gridDataSource"
      :error-row-enabled="false"
      :hover-state-enabled="false"
      :on-editing-start="onEditingStart"
      :on-init-new-row="onInitNewRow"
      :on-row-dbl-click="editModeOnClick"
      :on-row-removing="onRowRemoving"
      :remote-operations="true"
      :toolbar="GridToolbarDefaultConfig"
      :header-filter="{ visible: true }"
      :search-panel="{ visible: true, width: null }"
      :paging="{ pageSize: pageSize }"
      :pager="GridPagerDefaultConfig"
    >
      <dx-editing
        :allow-adding="true"
        :allow-updating="true"
        :allow-deleting="true"
        :confirm-delete="false"
        mode="popup"
      >
        <dx-popup
          :visible="isPopupVisible"
          width="600"
          max-width="92vw"
          height="auto"
          :drag-enabled="false"
          :enable-body-scroll="true"
          position="center"
          content-template="popup-form-template"
          :wrapper-attr="{ class: 'dx-popup-user-view' }"
        >
          <dx-toolbar-item
            v-if="!readOnly"
            widget="dxButton"
            location="after"
            toolbar="bottom"
            :options="{
              stylingMode: 'contained',
              text: editPopupSubmitButtom,
              onClick: confirmClick,
            }"
          />
          <dx-toolbar-item
            widget="dxButton"
            location="after"
            toolbar="bottom"
            :options="{
              text: $t('cancel'),
              onClick: cancelClick,
            }"
          />
        </dx-popup>
      </dx-editing>
      <dx-column
        :caption="$t('name')"
        data-field="name"
        cell-template="user-name-with-photo-template"
        width="20%"
      />
      <template #user-name-with-photo-template="{ data }">
        <div class="user-name-with-photo">
          <grid-image-column
            :source="data.data.avatar"
            :image-placeholder="data.data.name"
            :image-height="'3rem'"
            :image-width="'3rem'"
          />
          <span>{{ data.data.name }}</span>
        </div>
      </template>
      <dx-column :caption="$t('email')" data-field="email" width="20%" />
      <dx-column :caption="$t('phone')" data-field="contact" />
      <dx-column type="buttons">
        <dx-button name="edit" css-class="dx-edit-delete dx-link-edit"
          ><span class="material-symbols-rounded">{{ "edit" }}</span></dx-button
        >
        <dx-button name="delete" css-class="dx-edit-delete dx-link-delete"
          ><span class="material-symbols-rounded">{{ "delete" }}</span></dx-button
        >
        <dx-button
          name="cancel"
          css-class="dx-theme-accent-as-text-color  dx-cancel-save dx-link-cancle"
          ><span class="material-symbols-rounded">{{ "edit_off" }}</span></dx-button
        >
        <dx-button
          name="save"
          css-class="dx-theme-accent-as-text-color  dx-cancel-save dx-link-save"
          ><span class="material-symbols-rounded">{{ "save" }}</span></dx-button
        >
      </dx-column>
      <template #popup-form-template>
        <dx-scroll-view height="450">
          <div class="popup-title-cutom dx-theme-accent-as-text-color">
            {{ editPopupTitle }}
          </div>
          <div class="dx-datagrid-edit-popup-form">
            <entity-picture
              v-model:image-source="formData.avatar"
              :container-height="'15rem'"
              :container-width="'15rem'"
              :read-only="readOnly"
              :image-placeholder="formData.name"
            />
            <dx-form
              v-if="isPopupVisible"
              :form-data="formData"
              :on-initialized="onInitializedFormInstance"
              label-location="left"
              label-mode="static"
              validation-group="user-form-validator"
            >
              <dx-group-item :col-count="24">
                <dx-simple-item
                  :col-span="12"
                  :label="{ text: $t('name') }"
                  :editor-options="{
                    readOnly: readOnly,
                    placeholder: $t('name'),
                  }"
                  data-field="name"
                >
                  <dx-required-rule />
                </dx-simple-item>
                <dx-simple-item
                  :col-span="12"
                  :editor-options="{
                    readOnly: readOnly || !isNew,
                    placeholder: $t('email'),
                  }"
                  :label="{ text: $t('email') }"
                  data-field="email"
                >
                  <dx-required-rule />
                  <dx-email-rule />
                </dx-simple-item>
              </dx-group-item>
              <dx-simple-item
                css-class="linked-form-field-right"
                :editor-options="{
                  readOnly: readOnly,
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
                    message:
                      'Introduza um número de contacto válido (mínimo 10 ou máximo 15 dígitos)',
                  },
                ]"
              />
              <dx-group-item :col-count="24" v-if="isNew">
                <dx-simple-item
                  :col-span="12"
                  :label="{ text: $t('newPassword') }"
                  data-field="userPassword"
                  :editor-options="editorOptionsNEWPassword"
                >
                  <dx-required-rule />
                  <dx-pattern-rule
                    :pattern="pattern.lower"
                    :message="$t('passwordLower')"
                  />
                  <dx-pattern-rule
                    :pattern="pattern.upper"
                    :message="$t('passwordUpper')"
                  />
                  <dx-pattern-rule
                    :pattern="pattern.numeric"
                    :message="$t('passwordNumeric')"
                  />
                  <dx-pattern-rule
                    :pattern="pattern.special"
                    :message="$t('passwordSpecial')"
                  />
                  <dx-string-length-rule
                    :min="9"
                    :max="32"
                    :message="$t('passwordLength')"
                  />
                </dx-simple-item>
                <dx-simple-item
                  :col-span="12"
                  :label="{ text: $t('passwordConfirmation') }"
                  data-field="passwordConfirmation"
                  :editor-options="editorOptionsConfirmPassword"
                >
                  <dx-required-rule />
                  <dx-compare-rule
                    :comparison-target="comparisonTargetPassword"
                    :message="$t('passwordMismatch')"
                  />
                </dx-simple-item>
              </dx-group-item>
            </dx-form>
          </div>
        </dx-scroll-view>
      </template>
    </dx-data-grid>
  </main>
</template>
<script setup>
import "devextreme-vue/html-editor";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxPopup,
  DxButton,
} from "devextreme-vue/data-grid";
import DxForm, {
  DxRequiredRule,
  DxSimpleItem,
  DxEmailRule,
  DxGroupItem,
  DxStringLengthRule,
  DxCompareRule,
  DxPatternRule,
} from "devextreme-vue/form";
import { DxToolbarItem } from "devextreme-vue/popup";
import { DxScrollView } from "devextreme-vue/scroll-view";
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import notification from "@/utils/notification";
import onRowRemoving from "@/utils/custom-grid-row-delete-confirmation-dialog";
import GridToolbarDefaultConfig from "@/utils/grid-toolbar-default-config";
import GridPagerDefaultConfig from "@/utils/grid-pager-default-config";
import EntityPicture from "@/components/utils/EntityPicture.vue";
import GridImageColumn from "@/components/utils/GridImageColumn.vue";
import { useI18n } from "vue-i18n";
import _ from "lodash";
// =======
const store = useStore();
const { t } = useI18n();
// --
const pageSize = ref(5);
const isNew = ref(true);
const isPopupVisible = ref(false);
const formInstance = ref(null);
const formData = ref({});
const originalFormData = ref({});
const readOnly = ref(false);
const hidePassword = ref({ old: true, new: true, confirm: true });
// ---
const editPopupTitle = computed(
  () => `${isNew.value ? t("new") : t("edit")} ${t("user")}`
);
const editPopupSubmitButtom = computed(() => `${isNew.value ? t("create") : t("save")}`);
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
const pattern = {
  lower: "^(?=.*[a-z]).*$",
  upper: "^(?=.*[A-Z]).*$",
  numeric: "^(?=.*[0-9]).*$",
  special: "^(?=.*[*.!@#$%^&(){}[\\]:;'<>,.?/~`_+\\-=|\\\\]).*$",
};
// ---
const formDataDefaultValue = () => ({
  name: "",
  email: "",
  userPassword: "",
  avatar: "",
  contact: "",
});
const onInitializedFormInstance = (e) => {
  formInstance.value = e.component;
};
const comparisonTargetPassword = () => formData.value.userPassword;
const onEditingStart = (e) => {
  isNew.value = false;
  formData.value = { ...e.data };
  originalFormData.value = _.cloneDeep(e.data);
  isPopupVisible.value = true;
};
const onInitNewRow = () => {
  isNew.value = true;
  formData.value = { ...formDataDefaultValue() };
  isPopupVisible.value = true;
};
const cancelClick = () => {
  isNew.value = false;
  isPopupVisible.value = false;
};
const confirmClick = () => {
  const validator = formInstance.value.validate();
  if (validator.isValid) {
    if (!_.isEqual(formData.value, originalFormData.value)) {
      if (isNew.value) {
        gridDataSource.store().insert();
      } else {
        gridDataSource.store().update();
      }
    } else {
      isPopupVisible.value = false;
    }
  }
};
const editModeOnClick = (rowInfo) => {
  rowInfo.component.editRow(rowInfo.rowIndex);
};
// ---
const gridDataSource = new DataSource({
  store: new CustomStore({
    key: "userId",
    load(loadOptions) {
      notification.hideAll()
      const newLoadOptions ={
          "order": "",
          "orderBy": "",
          "pageSize": loadOptions.take,
          "search": "",
          "skip": loadOptions.skip,
      }
      if (loadOptions?.filter && Array.isArray(loadOptions?.filter)) {
        newLoadOptions.search=  loadOptions.filter[2]; 
      }
      return store
        .dispatch("users/GET_USERS", newLoadOptions)
        .then((result) => ({
          data: result, 
          totalCount: (result.length*2)
        }))
        .catch((error) => {
          notification.withOptionsAndStack({ message: error });
          return [];
        });
    },
    insert() {
      notification.hideAll();
      return store
        .dispatch("users/CREATE_USER", formData.value)
        .then((result) => {
          gridDataSource.reload();
          isPopupVisible.value = false;
          isNew.value = false;
          return result;
        })
        .catch((error) => {
          notification.withOptionsAndStack({ message: error });
        });
    },
    update() {
      notification.hideAll();
      return store
        .dispatch("users/UPDATE_USER", {
          userId: formData.value.userId,
          userInfo: formData.value,
        })
        .then((result) => {
          gridDataSource.reload();
          isPopupVisible.value = false;
          isNew.value = false;
          return result;
        })
        .catch((error) => {
          notification.withOptionsAndStack({ message: error });
        });
    },
    remove(userId) {
      notification.hideAll();
      return store
        .dispatch("users/DELETE_USER", { userId: userId })
        .then((result) => result)
        .catch((error) => {
          notification.withOptionsAndStack({ message: error });
        });
    },
  }),
  pageSize: pageSize.value,
});
</script>
<style lang="scss">
.dx-popup-user-view {
  .dx-popup-title.dx-toolbar .dx-toolbar-items-container {
    height: 35px;
  }
}
</style>
