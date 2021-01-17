<template>
  <div class="bg-red-200 flex flex-row items-center justify-center" style="min-height:100vh;">

      <div class="flex flex-col items-center w-full text-center mt-4">   
        <img src="@/assets/img/permissions-error-blob.svg" style="width:55%" alt="Darcy Logo" />
        <h1 class="mb-2">Oh no! Something went wrong!</h1>
        <b>You might need to give Darcy all the permissions from the solid interface.</b><br/>

        <div class="flex flex-row w-full md:w-2/3 flex-wrap">
          <div class="bg-red-300 rounded-md p-2 my-2 w-full text-red-800 items-center flex flex-col">
            <h3>Please give Darcy control permissions</h3>
            <ul class="list-disc text-left w-4/5">
              <li>
                Open your <a :href="ibex.myHost" class="font-bold underline" target="_blank">Solid Pod</a>
              </li>
              <li>
                Click "Login", then choose your correct webID (darcypod if you created the pod here)
              </li>
              <li>
                Click on the Preferences tab
              </li>
              <li>
                In the table below, check the <em>control</em> checkbox on the <em>shepherd.darcy.is</em> row
              </li>
              <li>
                Click the update button and then try again
              </li>
            </ul>
           
          </div>
        </div>
        
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
      },
      ibex(){
        return this.$store.state.ibex;
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