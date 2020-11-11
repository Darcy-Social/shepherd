<template>
  <div 
    class="flex flex-col items-center transition-colors"
    style="min-height:100vh" 
    id="bg"
    :class="{'bg-orange-200 text-black':isPublic,'bg-dark-500 text-white':!isPublic}"
  >
    <header>
      
      <h1 class="text-center">Create your {{(isPublic)?'Public':'PRIVATE'}} Feeds</h1>

      <span v-if="isPublic" class="font-bold text-center">
        These feeds will be visible to everybody<br/>
        (you don’t need to have one)
      </span>
      <span v-else class="font-bold text-center">
        Feeds that are visible only to the people you allow.<br/>
        For personal or risky topics.
      </span>

    </header>

    <div class="flex flex-row justify-around items-end">
      <FormGroup type="text" label="name" v-model="name" class="mr-2 text-black" />
      <FormGroup type="color" label="color" v-model="color" class="mx-2" />
      <button class="btn btn-primary" :disabled="disabledButton" @click="addFeed()">
        <img
          src="@/assets/img/loader.svg"
          class="animate-spin mr-2"
          style="line{stroke:white}"
          v-if="creating"
        />
        {{(!creating)?'Create Feed':'Creating feed'}}
      </button>
    </div>


    <div class="flex flex-col w-full md:w-1/2 mt-3">

      <div 
        v-for="feed in feedList"
        class="w-full rounded-full my-2 py-2 px-4 flex flex-row justify-between bg-gray-400"  
       
        :key="feed.url"
      >
        {{feed.name}}
        <button @click="deleteFeed(feed.url)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

    </div>

    <button class="btn btn-primary my-10" @click="isPublic=!isPublic">
      {{(isPublic)?'Private':'Public'}} Feeds
    </button>

    <router-link v-if="!isPublic" class="btn btn-green mt-2" to="/onboarding/profile">Continue</router-link>

  </div>
</template>

<script>
import FormGroup from '../../components/FormGroup'

export default {
    name:"feedsCreation",
    components:{
      FormGroup
    },
    data:()=>({
      isPublic:true,
      name:"",
      color:"#000000",
      publicFeeds:[],
      privateFeeds:[],
      disabledButton:false,
      creating:false,
    }),
    methods:{
      addFeed(){
        
        if(this.name.length){

          this.disabledButton = true;
          this.creating = true;

          this.ibex
          .createFeed(this.name)
          .then((res) => {

            console.log(res);

            this.feedList.push({
              name:this.name,
              color:this.color,
              url:res.url,
            });

            this.disabledButton = false;
            this.creating = false;
            this.name = "";
          })
          .catch((err) => {
            this.disabledButton = false;
            this.creating = false;
            console.error(err);
            alert("Sorry no feed created!")
          });
          
        }
      },
      deleteFeed(url){


        this.ibex.deleteRecursive(url)
        .then(res=>{
          if(this.isPublic){
            this.publicFeeds = this.publicFeeds.filter(el=>el.url!=url)
          }else{
            this.privateFeeds = this.privateFeeds.filter(el=>el.url!=url)
          }
        })
        .catch(err=>{
          console.error(err);
          alert("Error deleting feed")
        });

      },
    },
    computed:{
      feedList(){
        return (this.isPublic)?this.publicFeeds:this.privateFeeds;
      },
      ibex(){
        return this.$store.state.ibex;
      }
    },
    created(){
        
    }
}
</script>

<style>
  #bg{
    transition: background-color .15s ease-out,color .15s ease-out;
  }
</style>