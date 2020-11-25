<template>
  <div>
    <Sidebar />

    <main class="main">
      <h2>Edit your profile</h2>

      <div class="flex flex-row">
        <div class="w-1/2">
          <FormGroup type="text" v-model="profile.name" label="Shown Name" />
          <FormGroup type="textarea" v-model="profile.bio" label="Bio" />
          <FormGroup
            type="toggle"
            v-model="profile.isPublic"
            label="Public profile"
          />

          <button class="btn btn-primary mt-3" @click="saveProfile()" :disabled="isSaving">
            <img
              src="@/assets/img/loader.svg"
              class="animate-spin mr-1"
              v-if="isSaving"
            />
            {{(isSaving)?' Saving':' Save'}}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Vue from "vue";

import Sidebar from "../components/Sidebar";
import FormGroup from "../components/FormGroup";

export default {
  name: "Profile",
  components: {
    Sidebar,
    FormGroup,
  },
  data: () => ({
    profile: {
      name: "",
      bio: "",
      isPublic: true,
    },
    isSaving: false,
  }),
  methods: {
    saveProfile() {
      this.isSaving = true;

      this.$store.state.ibex
        .saveProfile(this.profile)
        .then((res) => {
          this.isSaving = false;
        })
        .catch((err) => {
          console.error(err);
          this.isSaving = false;
        });
    },
  },
  async created() {
    const gotSession = await Vue.checkSession();

    if (gotSession) {
      const profile = await Vue.getUserProfile("own");
      this.profile = profile;
    }
  },
};
</script>

<style>
</style>