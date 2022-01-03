<template>
  <div id="app" >
     <Errorhandler/>
     <Header v-if='this.$route.name !== "login"'/>
     <router-view/>
  </div>
</template>
<script>
/* eslint-disable */
import Service from './utils/Service';
import Header from './components/Header';
import Errorhandler from './components/Errorhandler.vue';
import router from './router';

export default {
  name: 'App',
  components:{
     Header,
     Errorhandler
  },
   beforeCreate(){
      if(Service.loginCheck()){
        if(this.$route.name == 'Login'){
          router.replace({name:'User'});  
        }
      }
      else{
        if(this.$route.name !== 'Login'){
          router.replace({name:'Login'});  
        }
      }
  },
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
