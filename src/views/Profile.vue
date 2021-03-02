<template>
  <div>
    <Sidebar />

    <main class="main">
      <h2>Edit your profile</h2>

      <div class="flex flex-row">
        <div class="w-1/2">
          <FormGroup type="text" v-model="profile.name" label="Shown Name" />
          <FormGroup type="textarea" v-model="profile.bio" label="Bio" />
          <FormGroup
            type="toggle"
            v-model="profile.isPublic"
            label="Public profile"
          />

          <button class="btn btn-primary mt-3" @click="saveProfile()" :disabled="isSaving">
            <img
              src="@/assets/img/loader.svg"
              class="animate-spin mr-1"
              v-if="isSaving"
            />
            {{(isSaving)?' Saving':' Save'}}
          </button>
        </div>
      </div>

      <h2 class="mt-2">Your Posts</h2>

      <img
          src="@/assets/img/loader.svg"
          class="animate-spin mx-auto"
          v-if="loadingPosts"
        />

      <post v-for="post in aggregatedPosts" :you="true" @deletePost="deletePost(post)" :post="post" :key="post"></post>
    </main>
  </div>
</template>

<script>
import Vue from "vue";

import { Ibex, FeedAggregator } from "../ibex.js";

import Sidebar from "../components/Sidebar";
import FormGroup from "../components/FormGroup";
import Post from '../components/Post';

export default {
  name: "Profile",
  components: {
    Sidebar,
    FormGroup,
    Post,
  },
  data: () => ({
    aggregator:{},
    profile: {
      name: "",
      bio: "",
      isPublic: true,
    },
    isSaving: false,
    loadingPosts:false,
  }),
  computed:{
    ibex(){
      return this.$store.state.ibex;
    },
    publicFeeds() {
      return this.$store.state.publicFeeds || [];
    },
    aggregatedPosts() {
      return this.aggregator.posts || [];
    },
  },
  methods: {

    //Save the user profile to profile.json
    saveProfile() {
      this.isSaving = true;

      this.$store.state.ibex
        .saveProfile(this.profile)
        .then((res) => {
          this.isSaving = false;
        })
        .catch((err) => {
          console.error(err);
          this.isSaving = false;
        });
    },

    //Get the user's own feeds (if not loaded)
    getOwnFeeds(){
     
     if (!this.publicFeeds.length) {
        this.ibex
          .manifest()
          .then((res) => {
            this.$store.commit("setPublicFeeds", res);
            this.getOwnPosts();
          })
          .catch((err) => console.log(err));
      }else{
        this.getOwnPosts();
      }

    },
    //Load posts from the Feed Aggregator
    getPosts: async function () {
      this.loadingPosts = true;

      let next = await this.aggregator.getNextOlderPostUrl();

      while (next) {
        next = await this.aggregator.getNextOlderPostUrl();
      }

      this.loadingPosts = false;
    },

    //Initialize the Feed Aggregator with the user's own feeds
    getOwnPosts(){
      //get posts from the user's own feeds
      this.aggregator = new FeedAggregator(this.publicFeeds.map(el=>el.url));
      this.getPosts().then((res) => {});
    },

    //Delete the user's own post
    deletePost(post){
      
      this.ibex.deletePost(post,this.ibex.myHost)
      .then(res=>{
        //console.log(res);
        this.aggregator.posts = this.aggregator.posts.filter(el=>el!=post);
      })
      .catch(err=>{
        console.error(err);
      })

    }

  },
  async created() {
    const gotSession = await Vue.checkSession();

    if (gotSession) {
      const profile = await Vue.getUserProfile("own");
      this.profile = profile;

      this.getOwnFeeds();

    }
  },
};
</script>

<style>
</style>