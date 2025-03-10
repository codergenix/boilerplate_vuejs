<template>
  <div id="root">
    <div :class="cssClasses">
      <component
        :is="route.meta.layout"
        :is-large="screen.getScreenSizeInfo.isLarge"
        :is-x-small="screen.getScreenSizeInfo.isXSmall"
      >
        <router-view />
      </component>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive } from "vue";
import { RouterView, useRoute } from "vue-router";
import { sizes, subscribe } from "@/utils/media-query";
// ----
const route = useRoute();
// ---
const getScreenSizeInfo = () => {
  const screenSizes = sizes();
  return {
    isXSmall: screenSizes["screen-x-small"],
    isLarge: screenSizes["screen-large"],
    cssClasses: Object.keys(screenSizes).filter((cl) => screenSizes[cl]),
  };
};
const screen = reactive({
  getScreenSizeInfo: getScreenSizeInfo(),
});
// ---
const cssClasses = computed(() =>
  ["ua-bio-agro-flores"].concat(screen.getScreenSizeInfo.cssClasses)
);
const screenSizeChanged = () => {
  screen.getScreenSizeInfo = getScreenSizeInfo();
};
onMounted(() => {
  subscribe(screenSizeChanged);
});
</script>
