<template>
  <div class="flex-box-entity-picture-box">
    <div :id="dropZoneUuid" :style="dropZoneStyle" :class="dropZoneClass">
      <img
        v-if="$props.imageSource"
        :id="dropZoneImageUuid"
        :src="getImageBase64Type($props.imageSource)"
        :alt="$props.imagePlaceholder"
        class="drop-zone-image"
      />
      <dx-file-uploader
        :id="fileUploaderUuid"
        :ref="fileUploaderUuid"
        :dialog-trigger="`#${dropZoneUuid}`"
        :drop-zone="`#${dropZoneUuid}`"
        :multiple="false"
        :allowed-file-extensions="allowedFileExtensions"
        :accept="allowedFileExtensions.join(',')"
        :read-only="$props.readOnly"
        upload-mode="useForm"
        :visible="false"
        @value-changed="onValueChanged"
        :on-initialized="onInitializedFormInstance"
      />
      <div class="overlay" v-if="!$props.readOnly">
        <dx-button
          styling-mode="outlined"
          type="normal"
          :element-attr="{
            class: 'drop-zone-edit',
          }"
        >
          <span class="material-symbols-rounded">{{ "edit" }}</span>
        </dx-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { v4 as uuid } from "uuid";
import DxButton from "devextreme-vue/button";
import { DxFileUploader } from "devextreme-vue/file-uploader";
import {
  getImageBase64Type,
  removeImageBase64Type,
} from "@/utils/image-Base64-mime-type-get-set";
import notification from "@/utils/notification";
// ----
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: () => false,
  },
  imageSource: {
    type: String,
    default: () => null,
  },
  imagePlaceholder: {
    type: String,
    default: () => "",
  },
  containerHeight: {
    default: () => "6rem",
  },
  containerWidth: {
    default: () => "6rem",
  },
});
const emit = defineEmits(["imageSource"]);
// ---
const dropZoneUuid = `drop-zone-${uuid()}`;
const dropZoneImageUuid = `drop-zone-image-${uuid()}:not(.drop-zone-remove)`;
const dropZoneInstance = ref(null);
const fileUploaderUuid = `drop-zone-file-uploader-${uuid()}`;
const dropZoneStyle = {
  height: props.containerHeight,
  width: props.containerWidth,
};
const dropZoneClass = computed(() => ({
  "drop-zone": true,
  "drop-zone-active": !props.readOnly,
}));
const allowedFileExtensions = [".jpg", ".jpeg", ".gif", ".png"];
const onInitializedFormInstance = (e) => {
  dropZoneInstance.value = e.component;
};
const onValueChanged = (e) => {
  if (!e.value.length) return;
  const file = e.value[0];
  if (file) {
    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    if (file.size > 1000000) {
      notification.withOptionsAndStack({
        message: `O tamanho do ficheiro deve ser inferior a 1 MB. ${fileSizeInMB}MB`,
      });
      dropZoneInstance.value.reset();
    } else if (!allowedFileExtensions.includes(fileExtension)) {
      notification.withOptionsAndStack({
        message: "Apenas são permitidos ficheiros de imagem (JPG, JPEG, PNG, GIF).",
      });
      dropZoneInstance.value.reset();
      return;
    } else {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        emit("update:imageSource", removeImageBase64Type(fileReader.result));
        dropZoneInstance.value.reset();
      };
      fileReader.readAsDataURL(file);
    }
  }
};
</script>
<style lang="scss" scoped>
.flex-box-entity-picture-box {
  display: flex;
  min-height: 18rem;
  min-width: 18rem;
  align-content: center;
  flex-wrap: nowrap;
  position: relative;
  .drop-zone {
    cursor: default;
    display: flex;
    border-radius: 0.5rem;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 1px solid #d2d4d4;
    .overlay {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(111, 119, 123, 0.53);
    }
    .dx-button.drop-zone-edit {
      border: 1px solid rgb(255, 255, 255);
      background-color: transparent;
      color: rgba(249, 249, 249, 0.87);
      border-radius: 100%;
      height: 42px;
    }
    &.drop-zone-active {
      cursor: pointer;
    }
    .drop-zone-image {
      border-radius: 0.5rem;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .drop-zone-text {
      color: #b2b3b5;
      font-weight: 350;
    }
  }
  .dx-form-group-with-caption > .dx-form-group-content {
    border-top: none !important;
  }
}
</style>
