<template>
  <div class="flex-box-entity-picture">
    <div :id="dropZoneUuid" :style="dropZoneStyle" :class="dropZoneClass">
      <img
        v-if="props.imageSource"
        :id="dropZoneImageUuid"
        :src="getImageBase64Type(props.imageSource)"
        :alt="props.name"
        class="drop-zone-image"
      />
      <dx-button
        :visible="!props.readOnly"
        :element-attr="{
          class:
            'drop-zone-edit dx-theme-accent-as-background-color dx-theme-background-color-as-text-color',
        }"
      >
        <div class="material-symbols-rounded drop-zone-edit_icon">photo_camera</div>
      </dx-button>
    </div>
    <dx-file-uploader
      :id="fileUploaderUuid"
      :ref="fileUploaderUuid"
      :dialog-trigger="`#${dropZoneUuid}`"
      :drop-zone="`#${dropZoneUuid}`"
      :multiple="false"
      :allowed-file-extensions="allowedFileExtensions"
      :accept="allowedFileExtensions.join(',')"
      :read-only="props.readOnly"
      upload-mode="useForm"
      :visible="false"
      @value-changed="onValueChanged"
      :on-initialized="onInitializedFormInstance"
    />
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
  isModal: {
    type: Boolean,
    default: () => false,
  },
  imageSource: {
    type: String,
    default: () => null,
  },
  name: {
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
.flex-box-entity-picture {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
  min-height: 14rem;
  min-width: 18rem;
  margin-bottom: 1rem;
  position: relative;
  .drop-zone {
    cursor: default;
    display: flex;
    border-radius: 50%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 1px solid #d2d4d4;
    .dx-button.drop-zone-edit {
      position: absolute;
      top: 79%;
      left: 79%;
      border-radius: 50%;
    }
    &.drop-zone-active {
      cursor: pointer;
    }
    .drop-zone-image {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .drop-zone-text {
      color: #b2b3b5 !important;
      font-weight: 350;
    }
    .title {
      padding-left: 2rem;
    }
  }
  .dx-form-group-with-caption > .dx-form-group-content {
    border-top: none !important;
  }
}
</style>
