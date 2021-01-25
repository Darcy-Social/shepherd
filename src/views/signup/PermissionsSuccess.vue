<template>
  <div class="bg-green-200 flex flex-row items-center justify-center" style="height:100vh;">

      <div class="flex flex-col items-center w-full">   
        <img src="@/assets/img/permissions-success-blob.svg" style="width:55%" alt="Darcy Logo" />
        <h1 class="mb-2">All Set!</h1>
        <router-link to="/onboarding/feeds" class="btn btn-primary">Create your feeds!</router-link>
    </div>

  </div>
</template>

<script>
import { setPaymentPointer } from "../../webMonetization.js";

export default {
    name:"permissionsSuccess",
    data:()=>({

    }),
    methods:{

    },
    created(){

    },
    mounted() {
      setPaymentPointer();
    },
}
</script>

<style>

</style>