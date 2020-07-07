<template>
  <div class="home flex flex-col">
    <div class="bg-primary-500 w-full text-center text-white flex flex-col justify-center">
      <img src="@/assets/img/logo-full-w.svg" class="w-50" alt="Darcy Logo" />
      <h1>Welcome to darcy!</h1>
    </div>
    <div class="w-full flex flex-col items-center justify-center">

      <router-link to="/login" class="btn btn-lg btn-secondary mb-4">Log In</router-link>
      <br />
      <a href class="text-primary-500">Log in with WebID</a>

      <h2>Or</h2>

      <router-link to="/register" class="btn btn-lg btn-primary mt-4">Create and account</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {}
};
</script>

<style scoped>
.home div {
  height: 50vh;
}
</style>
