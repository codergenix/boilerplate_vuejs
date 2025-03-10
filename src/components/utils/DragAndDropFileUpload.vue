<template>
  <div :id="$props.elementId">
    <div :id="dropZoneUuid" :class="dropZoneClass">
      <div v-if="$props.fileSource">
        <img
          :src="getImageBase64Type($props.fileSource)"
          alt="selectfile"
          width="45"
          height="45"
        />
        <div>{{ fileOBJ.name }}</div>
      </div>
      <div v-else id="dropzone-text" class="flex-box">
        <div>
          <span class="material-symbols-rounded drag-and-drop-icon">cloud_upload</span>
        </div>
        <div>
          <span class="drag-and-drop-main-text dx-theme-accent-as-text-color">{{
            $t("selectAfileToUpload")
          }}</span>
        </div>
        <div>
          <span class="drag-and-drop-secondary-text">{{
            $t("orDragAndDropItWere")
          }}</span>
        </div>
        <div style="margin-top: 1.5rem">
          <span class="drag-and-drop-secondary-text"
            >{{ $t("maximumFileSize") }} 1MB
          </span>
        </div>
      </div>
    </div>
    <dx-file-uploader
      :id="fileUploaderUuid"
      :dialog-trigger="`#${dropZoneUuid}`"
      :drop-zone="`#${dropZoneUuid}`"
      upload-mode="useButtons"
      :multiple="false"
      :visible="false"
      :allowed-file-extensions="allowedFileExtensions"
      :accept="allowedFileExtensions.join(',')"
      :max-file-size="1000000"
      @value-changed="onValueChanged"
      :on-initialized="onInitializedFormInstance"
    />
    <div v-if="validationErrors.length" class="error-messages">
      <p v-for="(error, index) in validationErrors" :key="index" class="error-text">
        {{ error.message }}
      </p>
    </div>
  </div>
</template>
<script setup>
import {
  removeImageBase64Type,
  getImageBase64Type,
} from "@/utils/image-Base64-mime-type-get-set";
import { DxFileUploader } from "devextreme-vue/file-uploader";
import { v4 as uuid } from "uuid";
import { computed, ref } from "vue";
// ----
const props = defineProps({
  elementId: {
    type: String,
    default: () => "drag-and-drop-upload",
  },
  readOnly: {
    type: Boolean,
    default: () => false,
  },
  fileSource: {
    type: String,
  },
});
const emit = defineEmits(["update:fileSource"]);
// ---
const dropZoneUuid = ref(`drop-zone-${uuid()}`);
const fileUploaderUuid = ref(`drop-zone-file-uploader-${uuid()}`);
const dropZoneClass = computed(() => ({
  "flex-box": true,
  "drop-zone": true,
  "drop-zone-active": !props.readOnly,
}));
const allowedFileExtensions = [".jpg", ".jpeg", ".gif", ".png"];
const dropZoneInstance = ref(null);
const validationErrors = ref([]);
const fileOBJ = ref({});
// ---
const onValueChanged = (e) => {
  validationErrors.value = [];
  if (!e.value.length) return;
  const file = e.value[0];
  if (file) {
    fileOBJ.value = file;
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (file.size > 1000000) {
      validationErrors.value.push({
        message: `O tamanho do ficheiro deve ser inferior a 1 MB. ${fileSizeInMB.MB}`,
      });
      dropZoneInstance.value.reset();
      return;
    } else if (!allowedFileExtensions.includes(fileExtension)) {
      validationErrors.value.push({
        message: `Tipo de ficheiro inválido. Permitido: JPG, JPEG, GIF, PNG. ${file.type}`,
      });
      dropZoneInstance.value.reset();
      return;
    } else {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        emit("update:fileSource", removeImageBase64Type(fileReader.result));
        dropZoneInstance.value.reset();
      };
      fileReader.readAsDataURL(file);
    }
  }
};
const onInitializedFormInstance = (e) => {
  dropZoneInstance.value = e.component;
};
</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: nowrap;
  height: 150px;
  .drag-and-drop-icon {
    font-size: 40px;
  }
  .drag-and-drop-main-text {
    font-size: 16px;
  }
  .drag-and-drop-secondary-text {
    font-size: 12px;
  }
  .file-uploaded {
    display: flex;
    align-items: center;
    flex-direction: row;
    .file-icon {
      font-size: 50px;
    }
  }
}
.drop-zone {
  border-width: 2px;
  border-style: dashed;
  border-color: #dddfdf;
  cursor: default;
  display: flex;
  justify-content: center;
  align-items: center;
  &.drop-zone-active {
    cursor: pointer;
  }
  &.drop-zone-error {
    border-color: #cc0000;
  }
  .drop-zone-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
