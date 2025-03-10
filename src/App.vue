<template>
  <div
    :class="isCompact ? 'dx-theme-compact' : 'nocompact'"
    class="dx-theme-background-color main"
  >
    <suspense>
      <template #fallback>
        <div class="loader" />
      </template>
      <template #error>
        <div class="error-message">Algo correu mal. Tente novamente mais tarde.</div>
      </template>
      <main-view :key="renderIndex" />
    </suspense>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import MainView from "@/components/layout/MainView.vue";
import config from "devextreme/core/config";
import { licenseKey } from "@/../devextreme-license";
import AppThemes from "@/utils/themes";
import _ from "lodash";
import i18n from "./i18n";
import { locale } from "devextreme/localization";
//--
const renderIndex = ref(0);
const isCompact = ref(_.includes(AppThemes.selectedTheme, "compact"));
// --
config({ licenseKey });
AppThemes.reloadMethod = () => {
  isCompact.value = _.includes(AppThemes.selectedTheme, "compact");
  setTimeout(() => {
    renderIndex.value += 1;
  }, 200);
};
// ---
onMounted(() => {
  AppThemes.onAppMount();
  isCompact.value = _.includes(AppThemes.selectedTheme, "compact");
  setTimeout(() => {
    const dxLicense = document.querySelector("dx-license");
    if (dxLicense) {
      dxLicense?.children[1].click();
    }
  }, 100);
});
watch(
  () => i18n.global.locale.value,
  (newLang) => {
    locale(newLang);
    setTimeout(() => {
      renderIndex.value += 1;
    }, 200);
  }
);
</script>
<style lang="css">
@import "material-symbols";
</style>
<style lang="scss">
@use '@/assets/scss/base.scss';
@use "@/assets/scss/bootstrap-grid.scss";
@use '@/assets/scss/custom-developer.scss';
</style>
<style lang="scss" scoped>
.loader::before,
.loader::after {
  content: "";
  position: absolute;
  border: 3px solid #1b3149;
  border-radius: 50%;
  animation: parent 2.5s linear infinite;
  -webkit-animation: parent 2.5s linear infinite;
}
.loader::before {
  width: 100px;
  height: 100px;
  border-left-style: dashed;
  border-bottom-style: dashed;
  top: calc(50% - 50px);
  left: calc(50% - 50px);
  animation-direction: normal;
}
.loader::after {
  width: 60px;
  height: 60px;
  border-left-style: dashed;
  border-right-style: dashed;
  top: calc(50% - 30px);
  left: calc(50% - 30px);
  animation-direction: reverse;
}
@keyframes parent {
  100% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
  }
}
</style>
