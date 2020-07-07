<template>
<transition name="slide-left">
  <div class="flex flex-row accountType">
    <div
      class="w-1/2 skewed text-white text-center flex flex-col justify-center items-center bg-no-repeat bg-contain"
      :style="{backgroundImage:'url('+require('@/assets/img/skewed-l.svg')+')'}"
    >
      <img src="@/assets/img/user.svg" class="w-1/4 mb-4" alt="Darcy comment bubble logo" />
      <h1 class="w-2/3 my-6">Which type of user describes you best?</h1>You can change these options anytime
    </div>

    <div class="w-1/2 flex flex-col justify-center items-center px-4">
      <AccountTypeChoice
        :icon="require('@/assets/img/ghost.svg')"
        title="Lurker"
        text="Nobody will be able to see your profile or posts"
        value="lurker"
        :active="type=='lurker'"
        @setValue="type='lurker'"
      />
      <AccountTypeChoice
        :icon="require('@/assets/img/lock.svg')"
        title="Private"
        text="You will be searchable and your profile will be visible but not your posts"
        value="private"
        :active="type=='private'"
        @setValue="type='private'"
      />
      <AccountTypeChoice
        :icon="require('@/assets/img/globe.svg')"
        title="Public"
        text="You will be searchable, your profile and posts will be visible"
        value="public"
        :active="type=='public'"
        @setValue="type='public'"
      />

      <button class="btn btn-primary mt-2" :disabled="type==''" @click="saveType()">Continue</button>
    </div>

    
  </div>
</transition>
</template>

<script>
import AccountTypeChoice from "../../components/AccountTypeChoice";

export default {
  name: "AccountType",
  components: {
    AccountTypeChoice
  },
  data: () => ({
    type: ""
  }),
  methods: {
    saveType(){
      this.$router.push("/register/account-settings")
    }
  },
  created() {}
};
</script>

<style scoped>
.accountType > div {
  height: 100vh;
}
</style>