<template>
  <div class="home flex flex-col">
    <div class="bg-primary-500 w-full text-center text-white flex flex-col justify-center">
      <img src="@/assets/img/logo-full-w.svg" class="w-50" alt="Darcy Logo" />
      <h1>Welcome to darcy!</h1>
    </div>
    <div class="w-full flex flex-col items-center justify-center">
      <button @click="login()" class="btn btn-lg btn-secondary mb-4">Log In</button>
      <br />
      <a href="#" class="text-primary-500" @click="showPopUp()">Log in with WebID</a>

      <h2>Or</h2>

      <router-link to="/register" class="btn btn-lg btn-primary mt-4">Create and account</router-link>
    </div>
  </div>
</template>

<script>
const auth = require("solid-auth-client");

export default {
  name: "home",
  components: {},
  methods: {
    async login() {
      const session = await auth.currentSession();
      if (!session)
        await auth.login("https://darcypod.com:8443", {
          callbackUri: "https://shepherd.darcy.is/"
        });
      else alert(`Logged in as ${session.webId}`);
    },
    async showPopUp() {
      let session = await auth.currentSession();
      let popupUri = "https://solid.community/common/popup.html";
      if (!session) session = await auth.popupLogin({ popupUri });
      this.$router.push("/feed");
    },
    async checkSession() {
      let session = await auth.currentSession();

      if(session){
        this.$router.push("/feed");
      }
      
    },
  },
  created(){
    this.checkSession();
  }
};
</script>

<style scoped>
.home div {
  height: 50vh;
}
</style>
