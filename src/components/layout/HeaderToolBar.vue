<template>
  <div>
    <dx-toolbar
      :key="route.path"
      class="header-toolbar dx-theme-accent-as-background-color"
      width="100%"
    >
      <dx-item
        :visible="props.menuToggleEnabled"
        locate-in-menu="before"
        location="before"
      >
        <dx-button
          :element-attr="{
            class: 'menu-button ',
          }"
          :width="AppThemes.menuMinWidth.value"
          styling-mode="text"
          @click="props.toggleMenuFunc"
        >
          <template #content>
            <div class="icon">
              <span class="material-symbols-rounded">{{
                props.opened ? "menu_open" : "menu"
              }}</span>
            </div>
          </template>
        </dx-button>
      </dx-item>
      <dx-item location="before">
        <router-link to="/">
          <div class="logo-header-wrap">
            <img alt="logo-header" class="logo-header" src="/images/LogoHeader.png" />
          </div>
        </router-link>
      </dx-item>
      <dx-item locate-in-menu="auto" location="before">
        <nav class="header-toolbar_nav">
          <router-link
            v-for="(page, idx) of mainPages"
            :key="page.name"
            :class="selected === idx ? 'dx-menu-item selected' : 'notSelected'"
            :title="page.title"
            :to="`/${page.name}`"
            class="header-toolbar_nav_link"
          >
            <span
              :class="{ 'dx-theme-accent-as-text-color': selected === idx }"
              class="material-symbols-rounded"
              name="headerMenuOptionIcon"
              :style="{ transform: `${!page.transform ? 'none' : page.transform}` }"
              >{{ page.iconName }}</span
            >
            <span name="headerMenuOptionTitle" class="name">{{ page.title }}</span>
          </router-link>
        </nav>
      </dx-item>
      <dx-item css-class="user-context-menu" locate-in-menu="naver" location="after">
        <dx-button
          :element-attr="{ class: `user-context-menu_button` }"
          styling-mode="text"
        >
          <span>{{ user.name }}</span>
          &nbsp;&nbsp;
          <grid-image-column
            :source="user.avatar"
            :image-placeholder="user.name"
            imageHeight="2.5rem"
            imageWidth="2.5rem"
          />
          <span class="material-symbols-outlined"> arrow_drop_down </span>
        </dx-button>
        <user-context-menu :menu-items="userMenuItems" target-class="user-context-menu" />
      </dx-item>
      <dx-item locate-in-menu="always" location="after">
        <dx-select-box
          :data-source="AppThemes.themesDataSource"
          :element-attr="{ class: 'dx-theme-border-color-as-text-color' }"
          :grouped="true"
          :value="AppThemes.selectedTheme"
          :wrap-item-text="false"
          display-expr="name"
          field-template="theme-field"
          value-expr="themeName"
          width="260"
          @value-changed="AppThemes.onThemeChangedEvent"
        >
          <template #theme-field="{ data }">
            <dx-text-box :buttons="generateTextBoxButtons(data)" :value="data?.name" />
          </template>
        </dx-select-box>
        <dx-select-box
          :data-source="[
            { value: 'en', label: 'English', icon: '/images/county/english.png' },
            { value: 'pt', label: 'Português', icon: '/images/county/portuguese.png' },
          ]"
          :value="selectedLanguage"
          display-expr="label"
          value-expr="value"
          :element-attr="{ class: 'dx-select-box-language' }"
          @value-changed="changeLanguage"
          :hover-state-enabled="false"
          :focus-state-enabled="false"
          field-template="lang-field"
          width="260"
        >
          <template #lang-field="{ data }">
            <dx-text-box :buttons="generateTextBoxButtons(data)" :value="data?.label" />
          </template>
        </dx-select-box>
      </dx-item>
    </dx-toolbar>
    <popup-change-password v-model:isPopupVisible="showChangePasswordPopup" />
    <popup-user-profile
      v-if="showProfilePopup"
      v-model:isPopupVisible="showProfilePopup"
    />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import DxButton from "devextreme-vue/button";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import { DxSelectBox } from "devextreme-vue/select-box";
import { DxTextBox } from "devextreme-vue/text-box";
import { RouterLink, useRoute, useRouter } from "vue-router";
import UserContextMenu from "@/components/layout/UserContextMenu.vue";
import AppThemes from "@/utils/themes";
import PopupChangePassword from "../popup/PopupChangePassword.vue";
import PopupUserProfile from "../popup/PopupUserProfile.vue";
import GridImageColumn from "../utils/GridImageColumn.vue";
import { useI18n } from "vue-i18n";
const { t, locale: i18nLocale } = useI18n();
// -----
const props = defineProps({
  menuToggleEnabled: Boolean,
  opened: Boolean,
  toggleMenuFunc: {
    type: Function,
    default: () => {},
  },
});
// -----
const router = useRouter();
const route = useRoute();
const store = useStore();
// ---
const showProfilePopup = ref(false);
const showChangePasswordPopup = ref(false);
const selectedLanguage = ref(i18nLocale.value);
const mainPages = [
  {
    iconName: "grid_view",
    name: "Users",
    title: t("users"),
  },
];
const selected = computed(() => {
  const mainPath = `${route.path.split("/")[1]}`;
  return mainPages.findIndex((page) => mainPath === page.name);
});
const user = computed(() => store.state.auth.user ?? {});
// ----
function onLogoutClick() {
  store.dispatch("auth/LOGOUT");
  router.replace({
    name: "login",
  });
}
const generateTextBoxButtons = (itemData) => [
  {
    location: "before",
    name: "themeIcon",
    options: {
      readOnly: true,
      elementAttr: {
        class: "theme-icon-disabled",
      },
      icon: itemData?.icon,
    },
  },
];
const userMenuItems = [
  {
    text: t("profile"),
    icon: "user",
    onClick: () => {
      showProfilePopup.value = true;
    },
  },
  {
    text: t("changePassword"),
    icon: "key",
    onClick: () => {
      showChangePasswordPopup.value = true;
    },
  },
  {
    text: t("logOut"),
    icon: "arrowright",
    onClick: onLogoutClick,
  },
];
const changeLanguage = (e) => {
  selectedLanguage.value = e.value;
  i18nLocale.value = e.value;
  localStorage.setItem("lang", e.value);
};
</script>
<style lang="scss">
.app-header {
  width: 100vw;
  height: auto;
  z-index: 1501;
  .dx-button-mode-text.dx-state-hover,
  .dx-button-mode-text.dx-state-active,
  .dx-button-mode-text.dx-state-focused {
    background-color: unset;
  }
  .header-toolbar {
    padding: 0.1rem;
    position: fixed;
    top: 0;
    .dx-button {
      background-color: transparent;
    }
    .dx-icon {
      color: white;
    }
    .dx-button-mode-text .dx-icon {
      color: white;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .header-toolbar_user .dx-button {
      height: auto;
      vertical-align: middle;
    }
    .menu-button > .icon {
      display: inline-flex;
      align-items: center;
      color: white;
    }
    .logo-header {
      width: 149px;
      @at-root .dx-theme-compact & {
        width: 80px;
      }
    }
    &_nav {
      &:first-child {
        margin: 0 2rem;
      }
      display: flex;
      height: 100%;
      &_link {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 1.6rem;
        cursor: pointer;
        text-decoration: none;
        .name {
          margin-left: 10px;
        }
        .material-symbols-rounded {
          font-size: 18px;
          padding: 4px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
        }
        &.selected {
          color: white;
          .material-symbols-rounded {
            background-color: rgba(255, 255, 255, 1);
          }
        }
        &.notSelected {
          color: white;
          opacity: 0.72;
        }
        &.notSelected:hover {
          opacity: 1;
        }
      }
    }
    .logo-header-wrap {
      padding-left: 25px;
      padding-right: 40px;
      border-right: thin solid rgba(255, 255, 255, 0.6);
    }
    .user-context-menu_button {
      height: auto;
      &.dx-button .dx-button-content {
        padding-block: 2px;
        padding-inline: 2px;
        .material-symbols-outlined {
          margin-inline: 4px;
          font-size: 17px;
        }
      }
    }
    .user-context-menu {
      &_button {
        color: #ffffffb8;
        > .dx-button-content > .dx-button-text {
          text-transform: none;
        }
      }
      &_button:hover {
        color: #ffffff;
        > .dx-button-content > .dx-button-text {
          text-transform: none;
        }
      }
    }
    .other-header-options {
      &_button {
        color: white;
        opacity: 0.72;
        .dx-button-content > .dx-button-text {
          text-transform: none;
        }
      }
      &_button:hover {
        opacity: 1;
      }
      &_span {
        color: white;
        opacity: 0.72;
        padding-right: 5px;
        cursor: default;
      }
    }
    @media screen and (max-width: 1120px) {
      span[name="headerMenuOptionTitle"] {
        display: none;
      }
    }
  }
}
.dx-toolbar-menu-section {
  .dx-toolbar-item-auto-hide {
    span[name="headerMenuOptionTitle"] {
      display: none;
    }
  }
}
.dx-select-box-language {
  margin-top: 1rem;
}
</style>
