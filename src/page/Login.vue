<template>
  <div class="Login py-5">
    <a-card title="Login" class="mx-auto" style="width: 400px">
      <div class="mb-3">
        <a-input placeholder="Enter user name" v-model="formdata.Email" />
         <div class="error_message">{{ validation.firstError('formdata.Email') }}</div>
      </div>
      <div class="mb-3">
        <a-input-password placeholder="password" v-model="formdata.Password" />
        <div class="error_message">{{ validation.firstError('formdata.Password  ') }}</div>
      </div>
      <div class="mb-3">
        <a-button type="primary" v-on:click="handlesubmit"> Login </a-button>
      </div>
    </a-card>
  </div>
</template>
<script>
/* eslint-disable */
import SimpleVueValidation from 'simple-vue-validator';
import {  mapActions } from 'vuex';
const Validator = SimpleVueValidation.Validator;

export default {
  name: "Login",
  data() {
    return {
      formdata: { Email:'', Password:''},
    };
  },
   validators: {
      'formdata.Email' : function (value) {
          return Validator.value(value).required().email();
       },
      'formdata.Password' : function (value) {
        return Validator.value(value).required();
      }
  },
   methods: {
     ...mapActions(["checklogin"]),
    async handlesubmit(e) {  
      let validated = await this.$validate();
      if(validated){
        let postdata =  {
               "Email": this.formdata.Email,
               "Password": this.formdata.Password
            }
            this.checklogin(postdata);
      }
    }
  }
};
</script>
<style scoped>
.testing {
  color: #42b983;
}
</style>

