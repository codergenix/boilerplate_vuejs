<template>
  <div id="login-form" class="login-form">
    <img src="/images/background.jpg" class="bgimage" alt="app-background" />
    <div class="card-login">
      <img alt="app-logo" class="logo-img" src="/images/logo.png" />
      <h3 class="logo-title">{{ $t("forgotPasswordTitle") }}</h3>
      <dx-form
        :disabled="loading"
        :form-data="loginData"
        validation-group="login"
        width="width"
        @initialized="onInitialized"
      >
        <dx-simple-item data-field="email" :editor-options="editorOptionsEmail">
          <dx-required-rule :message="$t('emailRequired')" />
          <dx-pattern-rule :pattern="emailValidationPattern" />
          <dx-label :text="$t('email')" />
        </dx-simple-item>
        <dx-button-item>
          <dx-button-options
            :on-click="onLoginForgot"
            template="login-template"
            :element-attr="{ class: 'login-button' }"
            type="default"
            width="100%"
          />
        </dx-button-item>
        <template #login-template>
          <dx-load-indicator :visible="loading" class="button-indicator-login" />
          <span v-if="!loading" class="login">{{ $t("submit") }}</span>
        </template>
      </dx-form>
    </div>
  </div>
</template>
<script setup>
import _ from "lodash";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import DxLoadIndicator from "devextreme-vue/load-indicator";
import DxForm, {
  DxButtonItem,
  DxButtonOptions,
  DxLabel,
  DxPatternRule,
  DxRequiredRule,
  DxSimpleItem,
} from "devextreme-vue/form";
import notification from "@/utils/notification";
// ----
const router = useRouter();
const store = useStore();
// --
const loading = ref(false);
const formInstance = ref(null);
const loginData = ref({});
const editorOptionsEmail = {
  placeholder: "nome@email.com",
  mode: "email",
  buttons: [
    {
      location: "before",
      name: "email",
      options: {
        stylingMode: "text",
        type: "normal",
        template: `<span class='material-symbols-outlined'>mail</span>`,
      },
    },
  ],
};
const onInitialized = (event) => {
  formInstance.value = event.component;
};
const onLoginForgot = _.debounce(() => {
  notification.hideAll();
  const validator = formInstance.value.validate();
  if (validator.isValid) {
    loading.value = true;
    return store
      .dispatch("auth/FORGOT_PASSWORD", {
        email: loginData.value.email,
      })
      .then(async () => {
        loading.value = false;
        await router.replace({ path: "/" });
      })
      .catch((error) => {
        notification.withOptionsAndStack({
          message: error,
        });
        loading.value = false;
      });
  }
  return validator.isValid;
}, 250);
const emailValidationPattern = /^((?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)([A-Za-z0-9.-]*[A-Za-z0-9]\.[A-Za-z0-9]{2,})$/;
</script>
<style lang="scss" scoped>
.login-form {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  img.bgimage {
    position: fixed;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
  }
  .card-login {
    position: relative;
    display: flex;
    flex-flow: column;
    width: 100%;
    max-width: 446px;
    padding: 34px 55px;
    border-radius: 24px;
    background-color: #fffffff2;
    @at-root [class*="-dark"] & {
      background-color: #363640;
    }
    .logo-img {
      width: 147px;
      margin: 0 auto;
    }
    .logo-title {
      margin-block: 22px;
      font-size: 35px;
      font-weight: 700;
      text-align: center;
      font-family: Poppins, serif;
    }
    .login-button {
      height: 48px;
    }
    .dx-field-item-label {
      position: relative;
    }
  }
}
</style>
