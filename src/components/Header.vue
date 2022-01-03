<template>
    <div class="header">
        <a-row type="flex" align="middle">
          <a-col :flex="1" class="text-start"><img src="../assets/image/logo.png" width="40" /></a-col>
          <a-col><div class="px-3"><a-avatar :size="45" icon="user" /> {{ userdata.FirstName }} {{userdata.LastName}} </div></a-col>
          <a-col><div class="px-3"><span class="link" @click="logout">Logout</span></div></a-col>
        </a-row>
     </div>
</template>
<script>
/* eslint-disable */
import Service from '../utils/Service';
export default {
  name: "Header",
   data() {
    return {
      userdata : {'FirstName':"user","LastName":"","RoleName":""}
    }
  },
  mounted() {
    if (localStorage.VUEuserdata) {
        this.userdata = Service.getUserData();    
    }
  },
  methods: {
    logout : function () {
        Service.logout();
    }
  }
};
</script>


