<template>
  <div class="login-form">
    <img src="/images/background.jpg" class="bgimage" alt="app-background" />
    <div class="card-login">
      <img alt="app-logo" class="logo-img" src="/images/logo.png" />
      <h3 class="logo-title">{{ $t("welcome") }}</h3>
      <dx-form
        :disabled="loading"
        :form-data="loginData"
        validation-group="login"
        @initialized="onInitialized"
      >
        <dx-simple-item data-field="email" :editor-options="editorOptionsEmail">
          <dx-required-rule :message="$t('emailRequired')" />
          <dx-pattern-rule :pattern="emailValidationPattern" />
          <dx-label :text="$t('email')" />
        </dx-simple-item>
        <dx-simple-item data-field="password" :editor-options="editorOptionPassword">
          <dx-label template="label-password" />
          <dx-required-rule :message="$t('passwordRequired')" />
        </dx-simple-item>
        <dx-simple-item
          :editor-options="{ text: $t('rememberMe') }"
          data-field="rememberMe"
          editor-type="dxCheckBox"
        >
          <dx-label :visible="false" />
        </dx-simple-item>
        <dx-button-item>
          <dx-button-options
            :on-click="onLogin"
            template="login-template"
            :element-attr="{ class: 'login-button' }"
            type="default"
            width="100%"
          />
        </dx-button-item>
        <template #label-password>
          <span class="dx-field-item-label-text">{{ $t("password") }}</span>
          <span class="forgotlink dx-theme-accent-as-text-color">
            <router-link to="/forgot-your-password"
              >{{ $t("forgotPassword") }}
            </router-link>
          </span>
        </template>
        <template #login-template>
          <dx-load-indicator :visible="loading" class="button-indicator-login" />
          <span v-if="!loading" class="login">{{ $t("loginButton") }}</span>
        </template>
      </dx-form>
    </div>
    <!-- <div class="footer"> <p>SINMETRO®</p> </div> -->
  </div>
</template>
<script setup>
import _ from "lodash";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, RouterLink } from "vue-router";
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
const passwordInstance = ref(null);
const loginData = ref({
  email: localStorage.getItem("rememberedEmail") || "",
  password: localStorage.getItem("rememberedPassword") || "",
  rememberMe: localStorage.getItem("rememberMe") === "true",
});
const hidePassword = ref(true);
const editorOptionPassword = computed(() => ({
  placeholder: "password",
  mode: hidePassword.value ? "password" : "text",
  buttons: [
    {
      location: "before",
      name: "passwordIcon",
      options: {
        stylingMode: "text",
        type: "normal",
        template: `<span class='material-symbols-outlined'>lock</span>`,
      },
    },
    {
      location: "after",
      name: "password",
      options: {
        elementAttr: {
          class: "show-hide-icon",
        },
        stylingMode: "text",
        type: "normal",
        template: `<span class='material-symbols-outlined'>${
          hidePassword.value ? "visibility" : "visibility_off"
        }</span>`,
        onClick: () => {
          hidePassword.value = !hidePassword.value;
        },
      },
    },
  ],
  onInitialized: onPasswordInitialized,
}));
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
const onPasswordInitialized = (event) => {
  passwordInstance.value = event.component;
};
const onLogin = _.debounce(() => {
  notification.hideAll();
  const validator = formInstance.value.validate();
  if (validator.isValid) {
    loading.value = true;
    if (loginData.value.rememberMe) {
      localStorage.setItem("rememberedEmail", loginData.value.email);
      localStorage.setItem("rememberedPassword", loginData.value.password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
      localStorage.setItem("rememberMe", "false");
    }
    return store
      .dispatch("auth/LOGIN", {
        email: loginData.value.email,
        password: loginData.value.password,
      })
      .then(async () => {
        loading.value = false;
        await router.push({ path: "/" });
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

const onKeyPressed = (event) => {
  if (event.key === "Enter") {
    onLogin();
  }
};
onMounted(() => {
  document.addEventListener("keydown", onKeyPressed);
  _.defer(() => {
    passwordInstance.value.blur();
  });
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeyPressed);
});
const emailValidationPattern = /^((?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)([A-Za-z0-9.-]*[A-Za-z0-9]\.[A-Za-z0-9]{2,})$/;
</script>
<style lang="scss">
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
      font-size: 32px;
      font-weight: 700;
      text-align: center;
      font-family: Poppins, serif;
    }
    .login-button {
      height: 48px;
    }
    .dx-field-item-label {
      position: relative;
      .forgotlink {
        position: absolute;
        right: 0;
        cursor: pointer;
      }
    }
    .dx-button-content .material-symbols-outlined {
      margin-inline: 0;
    }
    .dx-button .dx-button-content {
      padding-inline-start: 0;
      padding-inline-end: 0;
    }
  }
}
</style>
