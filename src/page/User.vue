<template>
  <div>
    <div class="project py-3">
        <h2>User list </h2>
        <!-- <p>{{alluser}}</p> -->
        <a-row type="flex" align="middle" :gutter="15">
        <a-col :flex="1">
           <div class="mb-3">
              <a-input  v-model="newevnetData.Email" @pressEnter="handleAdduser" placeholder="User Email Here..." /> 
              <div class="error_message">{{ validation.firstError('newevnetData.Email') }}</div>
           </div>
        </a-col>
        <a-col :flex="1">
           <div class="mb-3">
              <a-input  v-model="newevnetData.Password" @pressEnter="handleAdduser" placeholder="User Password Here..." /> 
              <div class="error_message">{{ validation.firstError('newevnetData.Password') }}</div>
           </div>
        </a-col>
        <a-col>
           <div class="mb-3">
             <a-button type="primary" @click="handleAdduser" icon="plus" />
           </div>
        </a-col>
      </a-row>
      <table class="table">
        <thead>
            <tr>
              <td> First Name </td>
              <td> Last Name </td>
              <td> Email  </td>
            </tr>
        </thead>
        <tbody>
            <tr class="tr-click" v-for="item in alluser" :key="item.ProjectGUID" @click="userrowclick(item)">
              <td> {{ item.FirstName }} </td>
              <td> {{ item.LastName }} </td>
              <td> {{ item.Email }} </td>
            </tr>
        </tbody>
      </table>
    </div>
      <ModalUser v-if='this.getUserModalvisible'  />
  </div>
</template>
<script>
/* eslint-disable */
import SimpleVueValidation from 'simple-vue-validator';
import { mapGetters, mapActions,mapMutations } from 'vuex';
import ModalUser from '../components/Modal/ModalUser';
const Validator = SimpleVueValidation.Validator;

export default {
  name: 'User',
  components:{
    ModalUser
  },
  data() {
    return {
      newevnetData:{
        FirstName:"",
        LastName:"",
        Email:"",
        Password:"", 
        Description:"",
      },
    };
  },
  computed: {
    ...mapGetters(["alluser","getUserModalvisible"]),
  },
   validators: {
      'newevnetData.Email':function (value){return Validator.value(value).required().email();},
      'newevnetData.Password':function (value){return Validator.value(value).required();},
  },
  methods:{
    ...mapActions(["getUser","addUser"]),
    ...mapMutations(['setUserCurrent','setUserModalvisible']),
    userrowclick(obj){
      this.setUserCurrent(obj);
      this.setUserModalvisible(true); 
    },
    async handleAdduser(){
      let validated = await this.$validate();
      if(validated){
        this.addUser(this.newevnetData);
      }
    }
  },
  created() {
    if (localStorage.VUEislogin){
      this.getUser();
    }
  },
 }
</script>
<style scoped>
.testing {
  color: #42b983;
}
</style>
