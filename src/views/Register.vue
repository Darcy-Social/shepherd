<template>
  <div class="flex flex-row login">
    <div class="w-1/2 flex flex-col items-center justify-center p-4">
      <div class="w-full">

        <div class="bg-danger-300 text-danger-700 px-3 py-2 rounded-md" v-html="errorMessage" v-if="errorMessage"></div>

        <form ref="registerForm" action="https://darcypod.com:8443/api/accounts/new" method="post" @submit.prevent="signup()">
        <FormGroup type="text" name="name" label="Name" v-model="name" :errors="errors" class="my-4" />
        <FormGroup type="text" name="username" label="Username" v-model="username" :errors="errors" class="my-4" />
        <FormGroup type="text" name="email" label="Email" v-model="email" :errors="errors" class="my-4" />
        <FormGroup type="password" name="password" label="Password" v-model="password" :errors="errors" class="my-4" />
        <FormGroup type="password" name="passwordConfirm" label="Confirm Password" :errors="errors" v-model="passwordConfirm" class="my-4" />

          <button :disabled="loading" type="submit" class="btn btn-primary my-4">Continue</button>
        </form>
        <button :disabled="loading" class="btn btn-secondary inline-block" @click="back()">Cancel</button>
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

export default {
  name: "registerView",
  components: {
    FormGroup
  },
  data: () => ({
    errors:[],
    errorMessage:"",
    loading:false,
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  }),
  methods: {
    signup() {

      //TODO spin 
      this.loading = true;

      this.errors = [];

      if(!this.name.length)
        this.errors.push({field:"name",message:"Please fill out this field"})

      if(!/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{10,}$/.test(this.password))
        this.errors.push({field:"password",message:`The password must be at least 10 characters long.<br>
        The password must contain at least one uppercase letter.<br>
        The password must contain at least one number.<br>
        The password must contain at least one special character`})

      if(this.passwordConfirm != this.password )
        this.errors.push({field:"passwordConfirm",message:"Passwords don't mach"})

      if(!this.username.length)
        this.errors.push({field:"username",message:"Please fill out this field"})

      if(! /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email))
        this.errors.push({field:"email",message:"Please enter a valid email address"})


      if(!this.errors.length){

        const body = new FormData();
        body.append("name",this.name);
        body.append("username",this.username);
        body.append("email",this.email);
        body.append("password",this.password);
        body.append("repeat_password",this.passwordConfirm);

        fetch("https://darcypod.com:8443/api/accounts/new",{
          method: "POST",
          body: new URLSearchParams([...body]),
          redirect: 'manual',
        })
        .then(res => {

          return res.text().then(text=>{
            return {text,status:res.status};
          });
          
        })
        .then(res=>{
          console.log(res);

          const text = res.text;
          //form error 
          if(res.status==400){
            //Create an html parser to get the error message
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(text, 'text/html');
            //get the alert element
            const alerts = htmlDoc.getElementsByClassName("alert-danger");
            if(alerts.length){
              if(typeof alerts[0]!=='undefined'){
                this.errorMessage = alerts[0].innerHTML;
                this.loading = false;
              }
            }
          
          }else if(res.status==0){ //creation successful
            this.$router.push("/register/success");
          }

        })
        .catch(err => {

          console.error(err);    
          
        });

      }else{
        this.loading = false;
      }

      
    },
    back(){
      this.$router.push("/")
    },
  },
  created() {

  }
};
</script>

<style scoped>
.login > div {
  height: 100vh;
}
.skewed {
  background-repeat: no-repeat;
  background-size: cover;
  padding-left: 10%;
}
</style>