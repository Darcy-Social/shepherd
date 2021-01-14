<template>
  <div class="home flex flex-col">
    <div class="bg-white h-50vh w-full text-center text-primary-500 flex flex-col justify-center items-center">
      <img src="@/assets/img/blob-logo.svg" class="w-1/4" alt="Darcy Logo" />
      <h1>Welcome to darcy!</h1>
    </div>
    <div class="w-full h-50vh flex flex-col items-center justify-center">
      <button @click="login()" class="btn btn-lg btn-secondary mb-4">Log In</button>
      <br />
      <a href="#" class="text-primary-500" @click="showPopUp()">Log in with WebID</a>

      <h2>Or</h2>

      <router-link to="/register" class="btn btn-lg btn-primary mt-4">Create an account</router-link>

      <button @click="checkSession()">Check session</button>
      

    </div>



   
  </div>
</template>

<script>
const auth = require("solid-auth-client");

export default {
  name: "home",
  components: {
  },
  data:()=>({
   }),
  methods: {

    //login using darcypod.com
    async login() {
      const session = await auth.currentSession();
      if (!session)
        await auth.login("https://darcypod.com:8443", {
          callbackUri: process.env.VUE_APP_ROOT_URL
        });
      else alert(`Logged in as ${session.webId}`);
    },

    //login using a custom solid provider using the standard popup
    async showPopUp() {
      let session = await auth.currentSession();
      let popupUri = "https://solidcommunity.net/common/popup.html";
      if (!session) session = await auth.popupLogin({ popupUri });
      this.$router.push("/feed");
    },

    //check if a solid session is present, if it exists then reditect to the feed view
    async checkSession() {

      let session = await auth.currentSession();

      if(session){
        //go to the feed view (home page)
        this.$router.push("/feed");
      }else{

        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });

        //if the url contains a token retry login (temporary fix)
        if(typeof vars['id_token'] !== 'undefined'){
          if(vars['id_token'].length){
             await auth.login("https://darcypod.com:8443", {
              callbackUri: process.env.VUE_APP_ROOT_URL
            });
          }

        }
       

      }
      
    },
  },
  created(){
    //on creation check if the session exists
    this.checkSession();
  }
};
</script>

<style scoped>
.h-50vh{
  height: 50vh;
}
</style>
