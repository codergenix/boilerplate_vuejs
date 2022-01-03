<template></template>
<script>
import { mapGetters,mapMutations } from 'vuex';
export default {
  name:'Errorhandler',
  computed:{
    ...mapGetters(['getUserMessage','getLoginMessage']),
  },
  methods:{
    ...mapMutations(['setLoginStateClear','setUserStateClear','setUserModalvisible']),
    Notification_success(Description='Successfully'){
      this.$notification.success({message:'Success',description:Description,duration:3});
    },
    Notification_warning(Description='Warning'){
      this.$notification.warning({message:'warning',description:Description,duration:3});
    },
    Notification_info(Description='Info'){
      this.$notification.info({message:'info',description:Description,duration:3});
    },
    Notification_error(Description='Failure'){
      this.$notification.error({message:'failure',description:Description,duration:4});
    },
  },
  watch: {
    //========= login handler ==========
    ['$store.state.Login.isLogin'] : async function(newState, oldState){
        if(newState==true){
          this.Notification_success(this.getLoginMessage);
          this.setLoginStateClear();
          setTimeout((e)=>{
            window.location.reload(false);
          },1500)
        }
    },
    ['$store.state.Login.isError'] : async function(newState, oldState){
        if(newState==true){
          this.Notification_error(this.getLoginMessage);
          this.setLoginStateClear();
        }
    },
    //========= user error handler =======
    ['$store.state.User.isUpdate'] : async function(newState, oldState){
        if(newState==true){
          this.Notification_success(this.getUserMessage);
          this.setUserStateClear();
        }
    },
    ['$store.state.User.isAdded'] : async function (newState, oldState){
        if(newState==true){
          this.Notification_success(this.getUserMessage);
          this.setUserStateClear();
          this.setUserModalvisible(true); 
        }
    },
    ['$store.state.User.isDelete'] : async function(newState, oldState){
        if(newState==true){
          this.Notification_success(this.getUserMessage);
          this.setUserStateClear();
        }
    },
    ['$store.state.User.isFileAdded'] : async function(newState, oldState){
        if(newState==true){
          this.Notification_success(this.getUserMessage);
          this.setUserStateClear();
        }
    },
    ['$store.state.User.isFileDelete'] : async function(newState, oldState){
        if(newState==true){
          this.Notification_success(this.getUserMessage);
          this.setUserStateClear();
        }
    },
    ['$store.state.User.isError'] : async function(newState, oldState){
        if(newState==true){
          this.Notification_error(this.getUserMessage);
          this.setUserStateClear();
        }
    },
    //======================================
   }
};  
</script>
