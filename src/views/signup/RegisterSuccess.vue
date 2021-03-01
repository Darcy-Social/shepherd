<template>
  <div class="bg-green-200 flex flex-col items-center justify-around" style="height:100vh">
    <div class="flex flex-col items-center w-full">
      <img src="@/assets/img/onboarding-success-person.svg" style="width:40%" alt="Darcy Logo" />
      <h1 class="mb-2">Account Created!</h1>
      <h2 class="mb-2">Now you can start to use Darcy!</h2>

      <div class="flex flex-row w-full md:w-2/3 flex-wrap">
          <div class="bg-green-300 rounded-md p-2 my-2 w-full text-green-800 items-center flex flex-col">
            <h2>Attention</h2>
            <h3>After your first login you'll see a page with several checkboxes.</h3>
            <h3 class="underline">For Darcy to work correctly all options must be selected.</h3>

            <label class="text-xl mt-2"><input type="checkbox" v-model="understandCheck"> I understand</label>
          </div>
      </div>
      
      <button class="btn btn-primary btn-lg" @click="login()" :disabled="!understandCheck">Log in now</button>
    </div>
  </div>
</template>

<script>

const auth = require("solid-auth-client");
import { setPaymentPointer } from "../../webMonetization.js";


export default {
  name: "registerSuccess",
  data: () => ({
     understandCheck:false
  }),
  methods:{
    async login() {
      const session = await auth.currentSession();
      if (!session)
        await auth.login("https://darcypod.com:8443", {
          callbackUri: "https://shepherd.darcy.is/"
        });
      else alert(`Logged in as ${session.webId}`);
    },
  },
  mounted() {
    setPaymentPointer();
  },
};
</script>

<style scoped>
.registerSuccess > div {
  height: 100vh;
}
.skewed {
  background: no-repeat contain;
  padding-left: 10%;
}
</style>

