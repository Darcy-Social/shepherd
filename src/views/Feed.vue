<template>
  
  <div>

    <Sidebar />

    <main class="main">
          <h2>Welcome to your feed: {{webid}}</h2>
         
          <button class="btn btn-primary" @click="makePost()">Make Post</button>
    </main>

  </div>
</template>

<script>
const auth = require("solid-auth-client");

import { Ibex } from "../ibex.js";

import Sidebar from '../components/Sidebar';

export default {
  components:{
    Sidebar
  },
  data: () => ({
    session: {},
    webid: "",
  }),
  computed: {
    ibex() {
      return this.$store.state.ibex;
    },
  },
  methods: {
    async checkSession() {
      console.log("checking session");
      let session = await auth.currentSession();

      if (session) {
        this.session = session;
        this.webid = session.webId;

        this.$store.state.session = session;
        this.$store.state.ibex = new Ibex(session.webId);
        this.checkPreferences();
      }
    },
   
    checkPreferences(){
     console.log("checking preferences");
     this.ibex.loadSettings()
     .then(res=>{
        this.$store.state.settings = res;
     })
     .catch(err=>{
       //Config file not found, perform onboarding
       if(err.status==404){
         this.$router.push("/onboarding/permissions");
       }
     });

    },

    makePost() {
      this.ibex
        .createPost("Test Post", "cats")
        .then((res) => {
          console.log(res);
          this.postUrl = res.url;
          this.nextTest();
        })
        .catch((err) => {
          this.errors.push(err);
          console.log(err);
        });
    },
    
  },
  created() {
    this.checkSession();
  },
  
};
</script>

<style>

</style>