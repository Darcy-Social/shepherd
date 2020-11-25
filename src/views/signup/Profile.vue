<template>
  <div
    class="bg-primary-200 flex flex-col items-center justify-around"
    style="height: 100vh"
  >
    <div class="flex flex-col items-center w-full">
      <img
        src="@/assets/img/onboarding-profile-person.svg"
        style="width: 40%"
        alt="Darcy Logo"
      />
      <h1 class="mb-2">Tell us about yourself</h1>
      If you want to. You only need a name to continue.
    </div>

    <div class="flex flex-row w-full md:w-1/2">
      <!-- <div class="w-1/2 flex flex-col items-center">
                <div class="rounded-full bg-white border-gray-500 border mb-4" style="width:150px;height:150px;" ></div>

                <button class="btn btn-orange">Change Picture</button>
            </div> -->
      <div class="w-full">
        <FormGroup type="text" v-model="name" label="Displayed name" />
        <FormGroup type="textarea" v-model="bio" label="Bio" />
        <label for="publicCheck"
          ><input id="publicCheck" type="checkbox" v-model="isPublic" />
          Public</label
        >
      </div>
    </div>

    <button @click="saveSettings()" class="btn btn-primary">
      Save & finish
    </button>
    <router-link class="btn btn-gray" to="/onboarding/feeds/new">Go Back</router-link>
  </div>
</template>

<script>
import FormGroup from "../../components/FormGroup";

import Vue from 'vue';

export default {
  name: "onboardingProfile",
  components: {
    FormGroup,
  },
  data: () => ({
    name: "",
    bio: "",
    isPublic: false,
    gotSession:false,
  }),
  computed: {
    ibex() {
      return this.$store.state.ibex;
    },
  },
  methods: {
    saveSettings() {
      if (this.name.length && this.gotSession) {
        const profile = {
          name: this.name,
          bio: this.bio,
          isPublic: this.isPublic,
        };

        this.ibex.saveProfile(profile).then((res) => {
          //save the profile data and set boarded to true in the settings
          this.ibex
            .saveSettings({boarded:true})
            .then((res) => {
              
              this.$router.push("/onboarding/success");
            })
            .catch((err) => {
              console.error(err);
            });

        });
      }
    },
  },
  async created(){
    this.gotSession = await Vue.checkSession();
  }
};
</script>

<style>
</style>