<template>
  <div class="p-2 relative text-center mt-2 ml-2 inline-block bg-primary-200 rounded-md">
    <h2>Logged in as {{webid}}</h2>
    <button class="btn btn-primary mt-4" @click="logout()">Log Out</button>
  </div>
</template>

<script>
const auth = require("solid-auth-client");

export default {
  data: () => ({
    session: {},
    webid: ""
  }),
  methods: {
    async checkSession() {
      console.log("checking session");
      let session = await auth.currentSession();

      if (session) {
        this.session = session;
        this.webid = session.webId;
      }
    },
    logout() {
      let vm = this;
      auth.logout().then(() => {
        vm.session = {};
        vm.webid = "";
        vm.$router.push("/");
      });
    }
  },
  created() {
    this.checkSession();
  }
};
</script>

<style>
</style>