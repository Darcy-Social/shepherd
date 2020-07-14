<template>
  <div class="flex flex-row registerSuccess">
    <div class="w-1/2 flex flex-col justify-center items-start px-4">
      <h1>The account has been created with success!</h1>

      <a href="https://darcypod.com:8443/login" class="btn btn-lg btn-primary mt-4">Login now</a>
    </div>
    <div
      class="w-1/2 skewed text-white text-center flex flex-col justify-center items-center bg-no-repeat bg-contain bg-right"
      :style="{backgroundImage:'url('+require('@/assets/img/skewed-r.svg')+')'}"
    >
      <img src="@/assets/img/logo-bubble-w.svg" class="w-1/4 mb-4" alt="Darcy comment bubble logo" />
      <h1 class="w-2/3 my-6">Account created!</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "registerSuccess",
  data: () => ({
    ok: "2"
  })
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

