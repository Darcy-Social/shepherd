<template>
  <div class="bg-red-200 flex flex-row items-center justify-center" style="min-height:100vh;">

      <div class="flex flex-col items-center w-full text-center mt-4">   
        <img src="@/assets/img/permissions-error-blob.svg" style="width:55%" alt="Darcy Logo" />
        <h1 class="mb-2">Oh no! Something went wrong!</h1>
        <b>You might need to give Darcy all the permissions from the solid interface.</b><br/>
        
        Check the following permissions:
        <div class="flex flex-row w-full md:w-2/3 flex-wrap">
          <div v-for="error in errors" class="bg-red-300 rounded-md p-2 my-2 w-full">
            <b>{{error.step}}</b><br/>
            {{JSON.stringify(error.err)}}
          </div>
        </div>

        <router-link class="btn btn-primary my-4" to="/onboarding/permissions">Try Again</router-link>
        
    </div>

  </div>
</template>

<script>
export default {
    name:"permissionsSuccess",
    data:()=>({

    }),
    computed:{
      errors(){
        return this.$store.state.permissionErrors;
      }
    }, 
    methods:{

    },
    created(){

    }
}
</script>

<style>

</style>