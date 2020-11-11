<template>
  <div>
    <Sidebar />

    <main class="main px-2 flex flex-col items-start">

    <router-link class="btn btn-secondary" to="/feed">Back to feed</router-link>

      <article
        class="flex w-full flex-col shadow-md rounded-lg bg-white p-2 border border-gray-300 my-4"
      >
        <header class="mb-2">
          <b>{{ user.name||feedData.pod }}</b> - {{ feedData.name }}<br />
          <small>{{ dateFromUrl.toLocaleString() }}</small>
        </header>
        <main class="">
          <img src="@/assets/img/loader.svg" class="animate-spin mx-auto " v-if="loadingContent" />
          {{ postText }}
        </main>
        <footer></footer>
      </article>
      
    </main>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar";
import Vue from 'vue';

export default {
  name: "SinglePostView",
  components: {
    Sidebar,
  },
 
  data: () => ({
      postText:"",
      loadingContent:false,
      user:{},
  }),
  computed:{
      ibex(){
          return this.$store.state.ibex;
      },
      post(){
          return this.$store.state.selectedPost;
      },
      dateFromUrl(){
            const splittedName = this.post.split("/");
            const dateStr = splittedName[9].replace(/\./g,":").replace(":md","").substr(0,19)+"Z";

            //return dateStr;
            return new Date(dateStr)
            
        },
        feedData(url){
            //Split the url
            const data = this.post.split("/");

            const pod = "https://"+data[2];
            const name = decodeURIComponent(data[5]);

            return {
                pod,
                name,
                url:url
            };
        }
  },
  methods:{
      fetchPost(){

        this.loadingContent = true;

            this.ibex.getText(this.post)
            .then(res=>{
                this.loadingContent = false;
                this.postText=res;
            })
            .catch(err=>{this.postText='Error fetching content'; console.error(err);this.loadingContent = false;});
        },
  },
  async created(){
      this.fetchPost();

      const profile = await Vue.getUserProfile(this.post);
      this.user = profile;
  }
};
</script>

<style>
</style>