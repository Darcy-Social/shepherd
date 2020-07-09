<template>
  <div class="flex flex-row login">
    <div class="w-1/2 flex flex-col items-center justify-center p-4">
      <div class="w-full">
        <FormGroup type="text" label="Name" v-model="name" class="my-4" />
        <FormGroup type="text" label="Username" v-model="username" class="my-4" />
        <FormGroup type="text" label="Email" v-model="email" class="my-4" />
        <FormGroup type="password" label="Password" v-model="password" class="my-4" />
        <FormGroup type="password" label="Confirm Password" v-model="passwordConfirm" class="my-4" />

        <button class="btn btn-primary my-4" @click="signup()">Continue</button>
        <button class="btn btn-secondary inline-block" @click="back()">Cancel</button>
      </div>
    </div>
    <div
      class="w-1/2 skewed text-white text-center flex flex-col justify-center items-center"
      :style="{backgroundImage:'url('+require('@/assets/img/skewed-r.svg')+')'}"
    >
      <img src="@/assets/img/logo-bubble-w.svg" class="w-1/4" alt="Darcy comment bubble logo" />
      <h1 class="w-2/3 mt-3">
        Enter your details
        to create an account
        on our server
        <br />
        <small class="text-sm font-light">
          <i>what does this mean?</i>
        </small>
      </h1>
    </div>
  </div>
</template>

<script>
import FormGroup from "../components/FormGroup";

const axios = require("axios");
import qs from 'qs';

export default {
  name: "loginView",
  components: {
    FormGroup
  },
  data: () => ({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: ""
  }),
  methods: {
    signup() {
      console.log("sent");

      axios({
        method: "POST",
        url: "https://darcypod.com:8443/api/accounts/new",
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({
          'name': this.name,
          'username': this.username,
          'email': this.email,
          'password': this.password,
          'repeat_password': this.passwordConfirm
        })
      })
      .then((res) => {
        console.log("account created")
        console.log(res);
        //TODO get token 
        this.$router.push("/")
      })
      .then((res) => {
        console.log("account created")
        console.log(res);
        //TODO get token 
        this.$router.push("/")
      })
      .catch((err) => {
        console.log(err)
      });

      
    },
    back(){
      this.$router.push("/")
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