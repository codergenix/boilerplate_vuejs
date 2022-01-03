<template>
  <div>
    <a-modal
      title="User"
      :width="700"
      :visible="this.getUserModalvisible"
      :footer="false"
       @cancel="Modalclose"
    >
     <!-- <p>{{formdata}}</p> -->
      <a-row type="flex" align="middle" :gutter="15">
        <a-col :flex="1">
           <div class="mb-3">
              <a-input  v-model="formdata.FirstName" /> 
              <div class="error_message">{{ validation.firstError('formdata.FirstName') }}</div>
           </div>
        </a-col>
        <a-col :flex="1">
           <div class="mb-3">
              <a-input  v-model="formdata.LastName" /> 
              <div class="error_message">{{ validation.firstError('formdata.LastName') }}</div>
           </div>
        </a-col>
        <a-col>
           <div class="mb-3">
            <a-button type="danger" @click="handleDeleteuser" icon="delete" />
            <a-button type="primary" @click="handleUpdateUser" icon="save" />
           </div>
        </a-col>
      </a-row>
      <a-row type="flex">
         <a-col :span="24">
           <label class="ant-label">Email </label>
           <div class="mb-3">
              <a-input  v-model="formdata.Email " /> 
               <div class="error_message">{{ validation.firstError('formdata.Email') }}</div>
           </div>
        </a-col>
        <a-col :span="24" >
          <label class="ant-label">Description </label>
           <div class="mb-3">
            <vue-editor v-model="formdata.Description"></vue-editor>
           </div>
        </a-col>
        <!-- <a-col :span="24">
            <label class="ant-label">User Files </label>
            <div>
               <a-upload :file-list="fileList" :remove="handleFileRemove" @change="handlerFileChange" :before-upload="beforeFileUpload">
                 <a-button> <a-icon type="upload" /> Attachment </a-button>
              </a-upload>
            </div>
            <a-list
                class="demo-loadmore-list"
                item-layout="horizontal"
                :data-source="formdata.UserFiles"
              >
                <a-list-item slot="renderItem" slot-scope="item,index" :key="index">
                    <a slot="actions" @click="deletefile(item)"><i class="fa-regular fa-trash-can text-danger fa-1x"></i></a>
                    <a-list-item-meta :description="item.FileAlterName" >
                       <a slot="title" target="_blank" :href="item.FileURL | fileurl">{{ item.FileName }}</a>
                       <a-avatar slot="avatar">{{item.FileName.split('.').pop()}}</a-avatar>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
        </a-col> -->
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment';
import SimpleVueValidation from 'simple-vue-validator';
import { mapGetters, mapActions,mapMutations } from 'vuex';
import { VueEditor } from "vue2-editor";
import CONFIG from '../../utils/config';
import Service from '../../utils/Service';
const Validator = SimpleVueValidation.Validator;
export default {
  name:"ModalUser",
   components: {
    VueEditor
  },
   data() {
    return {
      fileList: [],
    };
  },
  computed: {
      ...mapGetters({formdata:'getUserCurrent'}),
      ...mapGetters(['getUserModalvisible'])
  },
  filters: {
      fileurl(link) {
        if (!link) return ''
        link = CONFIG.API_URL+link
        return link
      }
  },
  validators: {
      'formdata.FirstName' : function (value) {
          return Validator.value(value).required();
       },
      'formdata.LastName' : function (value) {
        return Validator.value(value).required();
      },
      'formdata.Email' : function (value) {
        return Validator.value(value).required().email();;
      }
  },
  methods: {
     ...mapActions(["updateUser","deleteUser","addFileUser","deleteFileUser"]),
     ...mapMutations(['setUserModalvisible']),
     moment,
    handleDeleteuser(e) {
      this.deleteUser(this.formdata);
    },
    async handleUpdateUser(e) {
      let validated = await this.$validate();
      if(validated){
        this.updateUser(this.formdata);
      }
    },
    Modalclose(){
      this.setUserModalvisible(false); 
    },
    handleFileRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeFileUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handlerFileChange({ file, fileList }) {
      const FileForm = new FormData();
            FileForm.append('UserFile', file);
            let filedata = {};
            filedata.id  = this.formdata.id;
            filedata.CreatedBy = Service.getUserid();
            FileForm.append('FileData', JSON.stringify(filedata));
            this.addFileUser(FileForm);
    },  
    deletefile(data) {
      this.deleteFileUser(data);
    }  
  },
};
</script> 
