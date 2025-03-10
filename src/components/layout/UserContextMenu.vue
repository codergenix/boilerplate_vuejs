<template>
  <dx-context-menu
    :items="menuItems"
    :target="`.${targetClass}`"
    :width="210"
    show-event="click"
  >
    <dx-position at="bottom" my="top" />
  </dx-context-menu>
</template>
<script setup>
import DxContextMenu, { DxPosition } from "devextreme-vue/context-menu";
// ----
const { menuItems, targetClass } = defineProps({
  menuItems: {
    type: Array,
    default: () => [],
  },
  targetClass: {
    type: String,
    default: null,
  },
});
// ----
</script>
