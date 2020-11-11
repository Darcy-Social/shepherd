<template>
  <div>
    <Sidebar />

    <main class="main">
      <div class="flex flex-row">
        <div class="w-2/3">
          <FormGroup
            type="textarea"
            class="my-2"
            v-model="newPostText"
            :rows="3"
            placeholder="Write your post"
          />
        </div>
        <div class="w-1/3 px-1">
          <FormGroup
            type="select"
            v-model="feedToPostTo"
            :options="publicFeeds.map((el) => ({ id: el.name, name: el.name }))"
            class="my-2"
          />
          <button class="btn btn-primary w-full justify-center" @click="post()" :disabled="!newPostText.length">
            Post
          </button>
        </div>
      </div>

      <post v-for="post in createdPosts" :you="true" :post="post" :key="post" class="border-primary-400"></post>

      <post v-for="post in aggregatedPosts" :post="post" :key="post"></post>

      <img
        src="@/assets/img/loader.svg"
        class="animate-spin mx-auto"
        v-if="loadingPosts"
      />

      <button
        class="btn btn-primary mx-auto my-6"
        v-if="aggregatedPosts.length"
        @click="getPosts()"
      >
        <img
          src="@/assets/img/loader.svg"
          class="animate-spin mx-auto"
          v-if="loadingPosts"
        />
        {{(loadingPosts)?'Loading posts':'Load more posts'}}
      </button>
    </main>
  </div>
</template>

<script>
const auth = require("solid-auth-client");

import { Ibex, FeedAggregator } from "../ibex.js";

import Vue from "vue";

import Sidebar from "../components/Sidebar";
import FormGroup from "../components/FormGroup";
import Post from "../components/Post";

export default {
  name: "Feed",
  components: {
    Sidebar,
    FormGroup,
    Post,
  },
  data: () => ({
    newPostText: "",
    feedToPostTo: "",
    aggregator: {},
    loadingPosts: false,
    createdPosts:[],
  }),
  computed: {
    ibex() {
      return this.$store.state.ibex;
    },
    publicFeeds() {
      return this.$store.state.publicFeeds || [];
    },
    subscriptions() {
      return this.$store.state.settings.subscriptions || {};
    },
    aggregatedPosts() {
      return this.aggregator.posts || [];
    },
  },
  methods: {
    post() {
      this.ibex
        .createPost(this.newPostText, this.feedToPostTo)
        .then((res) => {
          console.info(res.url);
          this.createdPosts.push(res.url);
          this.newPostText = "";
        })
        .catch((err) => {
          console.log(err);
          alert("Error while creating post");
        });
    },

    getAggregatedFeeds() {
      //Grab all the feeds from the settings in the store and send to Aggregator
      let feeds = [];

      for (const sub in this.subscriptions) {
        this.subscriptions[sub].forEach((feed) => {
          feeds.push(feed.url);
        });
      }

      this.aggregator = new FeedAggregator(feeds);

      this.getPosts().then((res) => {});
    },

    getOwnFeeds() {
      if (!this.publicFeeds.length) {
        this.ibex
          .manifest()
          .then((res) => {
            this.$store.commit("setPublicFeeds", res);
          })
          .catch((err) => console.log(err));
      }
    },
    getPosts: async function () {
      this.loadingPosts = true;

      let next = await this.aggregator.getNextOlderPostUrl();

      while (next) {
        next = await this.aggregator.getNextOlderPostUrl();
      }

      this.loadingPosts = false;
    },
  },
  async created() {
    const gotSession = await Vue.checkSession();

    if (gotSession) {
      this.getOwnFeeds();

      const gotSettings = await Vue.checkSettings();

      if (gotSettings) {
        this.getAggregatedFeeds();
      }
    }
  },
};
</script>

<style>
</style>