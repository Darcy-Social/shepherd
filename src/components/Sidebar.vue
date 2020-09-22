<template>
  <aside
    class="sidebar bg-primary-500 p-2 rounded-full fixed top-0 left-0 m-2 flex flex-col justify-between items-center"
  >
    <img src="@/assets/img/logo-bubble-w.svg" aria-hidden="true" class="mt-4" style="width:80%" />

    <nav class="flex flex-col">
      <router-link
        class="py-4 px-1 my-2 text-white rounded-full bg-primary-400 hover:bg-primary-600"
        v-for="link in links"
        :key="link.url"
        :to="link.url"
        :title="link.name"
      >
        <inline-svg :aria-label="link.name" :src="require('@/assets/img/sidebar/'+link.icon)" />
      </router-link>
    </nav>

    <a href="#" @click="logout()" class="py-4 px-1 my-2 text-white rounded-full bg-primary-400 hover:bg-primary-600" title="Log Out">
      <inline-svg aria-label="Log Out" :src="require('@/assets/img/sidebar/logout.svg')" />
    </a>
  </aside>
</template>

<script>
import InlineSvg from "vue-inline-svg";
const auth = require("solid-auth-client");


export default {
  name: "sidebar",
  components: {
    InlineSvg,
  },
  data: () => ({
    links: [
      {
        name: "Home",
        icon: "home.svg",
        url: "/feed",
      },
      {
        name: "Users",
        icon: "users.svg",
        url: "/following",
      },
      {
        name: "Profile",
        icon: "user.svg",
        url: "/profile",
      },
      {
        name: "Settings",
        icon: "settings.svg",
        url: "/settings",
      },
    ],
  }),
  methods: {
    logout() {
      let vm = this;
      auth.logout().then(() => {
        vm.session = {};
        vm.webid = "";
        vm.$router.push("/");
      });
    },
  },
};
</script>

<style>
aside.sidebar {
  height: calc(100vh - 2rem);
}
</style>