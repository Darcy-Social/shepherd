<template>
  <div class="p-2 relative text-center mt-2 ml-2 inline-block bg-primary-200 rounded-md">
    <h2>Logged in as {{webid}}</h2>
    <button class="btn btn-primary mt-4" @click="logout()">Log Out</button>
  </div>
</template>

<script>
const auth = require("solid-auth-client");

import { Ibex, log } from "../ibex.js";

export default {
  data: () => ({
    session: {},
    webid: "",
    ibex: "",
  }),
  methods: {
    async checkSession() {
      console.log("checking session");
      let session = await auth.currentSession();

      if (session) {
        this.session = session;
        this.webid = session.webId;

        this.$store.state.ibex = new Ibex(session.webId);
        this.checkPreferences();
      }
    },
    logout() {
      let vm = this;
      auth.logout().then(() => {
        vm.session = {};
        vm.webid = "";
        vm.$router.push("/");
      });
    },

    checkPreferences(){

      // this.ibex.getText(this.ibex.root+"/preferences.json")
      // .then(res=>{
      //   console.log(res)
      // })
      // .catch(err=>{
      //   console.log(err)
      // })

      //for now just push to check
      this.$router.push("/onboarding/permissions");
    }
  },
  created() {
    this.checkSession();
  },
  
};
</script>

<style>
</style>