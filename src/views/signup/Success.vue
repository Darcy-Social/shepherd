<template>
  <div class="bg-green-200 flex flex-col items-center justify-around" style="height:100vh">
    <div class="flex flex-col items-center w-full">
      <img src="@/assets/img/onboarding-success-person.svg" style="width:55%" alt="Darcy Logo" />
      <h1 class="mb-2">We're done</h1>
      <h2 class="mb-2">Now you can start to use Darcy!</h2>
      <router-link to="/feed" class="btn btn-primary">Let's Go!</router-link>
    </div>
  </div>
</template>

<script>
export default {
    name:"onboardingSuccess",
    data:()=>({

    })
};
</script>

<style>
</style>