<template>
  <div class="bg-red-200 flex flex-row items-center justify-center" style="min-height:100vh;">

      <div class="flex flex-col items-center w-full">   
        <img src="@/assets/img/permissions-error-blob.svg" style="width:55%" alt="Darcy Logo" />
        <h1 class="mb-2">Oh no! Something went wrong!</h1>
        Check the following permissions:
    </div>

  </div>
</template>

<script>
export default {
    name:"permissionsSuccess",
    props:["errors"],
    data:()=>({

    }),
    methods:{

    },
    created(){

    }
}
</script>

<style>

</style>