<template>
  <div class="app-page">
    <header-toolbar
      :menu-toggle-enabled="false"
      class="app-header dx-theme-accent-as-background-color"
    />
    <div class="app-content">
      <slot />
    </div>
  </div>
</template>
<script setup>
import HeaderToolbar from "@/components/layout/HeaderToolBar.vue";
</script>
