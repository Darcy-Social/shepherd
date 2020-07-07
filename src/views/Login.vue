<template>
  <div class="flex flex-row login">
    <div class="w-1/2 flex flex-col items-center justify-center p-4">
      <div class="w-full">
        <!-- <FormGroup type="text" label="Email" v-model="email" class="my-4" />
        <FormGroup type="password" label="Password" v-model="password" class="my-4" /> -->

        <button class="btn btn-primary my-4" @click="login()">Log in</button>
      </div>
    </div>
    <div
      class="w-1/2 skewed text-white text-center flex flex-col justify-center items-center"
      :style="{backgroundImage:'url('+require('@/assets/img/skewed-r.svg')+')'}"
    >
      <img src="@/assets/img/logo-bubble-w.svg" class="w-1/4" alt="Darcy comment bubble logo" />
      <h1 class="w-2/3 mt-3">
        Enter your
        email & password
        to log into darcy!
      </h1>
    </div>
  </div>
</template>

<script>
//import FormGroup from "../components/FormGroup";

const auth = require("solid-auth-client");

export default {
  name: "loginView",
  components: {
    //FormGroup
  },
  data: () => ({
    email: "",
    password: ""
  }),
  methods: {
    async login() {
      const session = await auth.currentSession();
      if (!session) await auth.login("https://darcypod.com:8443",{
        callbackUri:"https://ibex.darcy.is"
      });
      else alert(`Logged in as ${session.webId}`);
    }
  },
  created() {}
};
</script>

<style scoped>
.login > div {
  height: 100vh;
}
.skewed {
  background: no-repeat contain;
  padding-left: 10%;
}
</style>