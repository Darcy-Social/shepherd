<template>
  <div>
    <Sidebar />

    <main class="main px-2">
      <h2>{{ $store.state.selectedUser }} Posts</h2>

      <Post :post="post" v-for="post in posts" :key="post" />
    </main>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import { FeedAggregator } from "../ibex.js";

import Vue from 'vue';

export default {
  name: "UserView",
  components: {
    Sidebar,
    Post,
  },
  data: () => ({
    aggregator: {},
  }),
  computed: {
    user() {
      return this.$store.state.selectedUser;
    },
    ibex() {
      return this.$store.state.ibex;
    },
    posts() {
      return this.aggregator.posts;
    },
    subscriptions() {
      return this.$store.state.settings.subscriptions || {};
    },
  },
  methods: {
    getAggregatedFeeds() {
      //Grab all the feeds from the store and send to Aggregator
      let feeds = [];

      console.log(this.subscriptions[this.user]);

      this.subscriptions[this.user].forEach((feed) => {
        feeds.push(feed.url);
      });

      this.aggregator = new FeedAggregator(feeds);

      this.getPosts().then((res) => {
        console.error(res);
      });
    },
    getPosts: async function () {
      let next = await this.aggregator.getNextOlderPostUrl();

      while (next) {
        next = await this.aggregator.getNextOlderPostUrl();
      }
    },
  },
  async created() {
    const gotSession = await Vue.checkSession();

    if (gotSession) {
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