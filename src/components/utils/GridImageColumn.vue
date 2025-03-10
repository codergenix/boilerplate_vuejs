<template>
  <div v-if="placeholder && !source" :style="divStyle" class="grid-image-placeholder">
    <div>{{ placeholder }}</div>
  </div>
  <div v-else :style="divStyle" class="grid-image">
    <img v-if="source" :src="getImageBase64Type(source)" alt="dynamic alt" />
    <img v-else src="/images/no-image.svg" alt="not available" />
  </div>
</template>
<script setup>
import { getImageBase64Type } from "@/utils/image-Base64-mime-type-get-set";
import { ref } from "vue";
// -----
const props = defineProps({
  source: {
    required: true,
    default: () => null,
  },
  imagePlaceholder: {
    type: String,
    default: () => "",
  },
  imageHeight: {
    default: () => "4rem",
  },
  imageWidth: {
    default: () => "4rem",
  },
});
// ----
const divStyle = {
  height: props.imageHeight,
  width: props.imageWidth,
};
const placeholder = ref(props.imagePlaceholder);
placeholder.value = placeholder.value.replace(/[^A-Z]/g, "");
placeholder.value = placeholder.value ? placeholder.value.slice(0, 3) : placeholder.value;
</script>
<style lang="scss" scoped>
.grid-image {
  border-radius: 50%;
  img {
    border-radius: 50%;
    height: 100%;
    width: 100%;
    object-fit: cover;
    background-color: white;
  }
}
.grid-image-placeholder {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #dddfdf;
  background-color: #f6f6f6;
  @at-root [class*="-dark"] & {
    background-color: #3f3f4b;
  }
  div {
    font-size: 1rem;
    padding: 0px;
    color: #25282a;
  }
}
</style>
