<template>
  <div>
    <Sidebar />

    <main class="main px-2">
      <button class="btn btn-primary" @click="isSubscribeModalVisible = true">
        Add Feed
      </button>

      <FormGroup class="mb-4" type="text" label="Filter" v-model="filterText" />

      <article
        v-for="(user, key) in filteredSubscriptions"
        :key="key"
        class="flex flex-row justify-between items-center shadow-md rounded-lg bg-white p-2 border border-gray-300 my-3"
      >
        <div class="flex flex-row items-center">
          <!-- <div 
                class="w-12 h-12 mr-4 border border-gray-300 rounded-full p-1 bg-cover bg-no-repeat bg-center" 
                :style="{backgroundImage:'url(\''+user.image+'\')'}"
                >
                    
                </div> -->
          <div @click="goToUser(key)" class="cursor-pointer">
            <span v-if="typeof profiles[key] !== 'undefined'">
              <b>{{ profiles[key].name }}</b
              ><br />
              <small v-if="profiles[key].name != key">{{ key }}</small>
            </span>
            <span v-else>{{ key }}</span>
          </div>
        </div>
        <div class="">
          <button
            class="btn btn-primary"
            @click="getUserFeeds({ url: key }, 'user')"
          >
            Subscriptions
          </button>
        </div>
      </article>

      <div
        v-if="!filteredSubscriptions"
        class="text-gray-600 flex flex-row justify-center"
      >
        No subscriptions found
      </div>

      <div class="p-4 bg-primary-200 rounded-md">
        <b>This is your webID, share this link with other people so they can
          follow you.</b><br />
        {{ ibex.myHost }}
        <button title="Copy this link" @click="copyWebID()">
          <img
            style="width: 15px; height: 15px"
            src="@/assets/img/clipboard.svg"
          />
        </button>
      </div>
    </main>

    <Modal
      v-show="isFeedsModalVisible"
      @close="isFeedsModalVisible = false"
      :title="feedsModalTitle"
    >
      <template v-slot:body>
        <div
          v-for="feed in userFeeds"
          :key="feed.url"
          class="flex flex-row items-center justify-between hover:bg-primary-100 p-2 rounded-md"
        >
          <span class="mr-4">{{ feed.name }}</span>
          <FormGroup type="toggle" v-model="feed.subscribed" />
        </div>
      </template>

      <template v-slot:footer>
        <div class="flex flex-row justify-center items-center">
          <button
            class="btn btn-gray mr-3"
            @click="
              isFeedsModalVisible = false;
              userFeeds = [];
              userName = '';
            "
          >
            Cancel
          </button>
          <button class="btn btn-primary" @click="saveSubscriptions()">
            Ok!
          </button>
        </div>
      </template>
    </Modal>

    <Modal
      v-show="isSubscribeModalVisible"
      @close="isSubscribeModalVisible = false"
      title="Add Feed"
    >
      <template v-slot:body>
        <FormGroup
          type="text"
          v-model="newFeedUrl"
          class="my-2"
          style="width: 25rem"
          label="Insert WebID"
          placeholder="Insert url"
        />
        <button
          class="btn btn-primary"
          @click="getUserFeeds({ url: newFeedUrl })"
          :disabled="isLoadingFeeds"
        >
          <img
            v-if="isLoadingFeeds"
            src="@/assets/img/loader.svg"
            class="animate-spin mr-2"
          />
          Load Feeds
        </button>

        <div
          v-for="feed in userFeeds"
          :key="feed.url"
          class="flex flex-row items-center justify-between hover:bg-primary-100 p-2 rounded-md"
        >
          <span class="mr-4">{{ feed.name }}</span>
          <FormGroup type="toggle" v-model="feed.subscribed" />
        </div>
      </template>

      <template v-slot:footer>
        <div class="flex flex-row justify-center items-center">
          <button
            class="btn btn-gray mr-3"
            @click="isSubscribeModalVisible = false"
          >
            Cancel
          </button>
          <button class="btn btn-primary" @click="saveSubscriptions()">
            Save
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import FormGroup from "../components/FormGroup";
import { setPaymentPointer } from "../webMonetization.js";

import Vue from "vue";

const $rdf = require("rdflib");
const FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

export default {
  name: "FollowingView",
  components: {
    Sidebar,
    FormGroup,
    Modal,
  },
  data: () => ({
    filterText: "",
    users: [],
    isFeedsModalVisible: false,
    userName: "",
    userFeeds: [],
    isSubscribeModalVisible: false,
    newFeedUrl: "",
    isLoadingFeeds: false,
    feedsModalTitle: "",
  }),
  computed: {
    filteredSubscriptions() {
      if (typeof this.settings.subscriptions !== "undefined") {
        if (this.filterText.length) {
          return this.settings.subscriptions.filter(
            (el) =>
              el.name.toLowerCase().indexOf(this.filterText.toLowerCase()) != -1
          );
        } else {
          return this.settings.subscriptions;
        }
      } else {
        return [];
      }
    },
    ibex() {
      return this.$store.state.ibex;
    },
    settings() {
      if (typeof this.$store.state.settings.subscriptions === "undefined") {
        this.$store.state.settings.subscriptions = {};
      }

      return this.$store.state.settings || {};
    },
    profiles(){
      return this.$store.state.usersCache;
    }
  },
  methods: {
    goToUser(user) {
      this.$store.commit("setSelectedUser", user);
      this.$router.push("/user");
    },

    getUserFeeds(user, destination) {
      this.isLoadingFeeds = true;
      // Clear previously loaded feeds
      this.userFeeds = [];
      // Reload the feed from the user's manifest file
      this.ibex
        .willFetch(
          this.ibex.urlDomain(user.url) + "/is.darcy/feed/manifest.json"
        )
        .then((res) => res.json())
        .then((feeds) => {
          for (const key in feeds) {
            let subscribed = false;

            if (typeof this.settings.subscriptions[user.url] !== "undefined") {
              if (
                this.settings.subscriptions[user.url].filter(
                  (el) => el.url == key
                ).length
              ) {
                subscribed = true;
              }
            }

            if (typeof this.profiles[user.url] !== "undefined") {
              //console.log(this.profiles[user.url]);

              if (typeof this.profiles[user.url].name !== "undefined")
                this.feedsModalTitle = this.profiles[user.url].name + " Feeds";
              else this.feedsModalTitle = user.url + " Feeds";
            } else {
              this.feedsModalTitle = user.url + " Feeds";
            }

            this.userFeeds.push({
              url: key,
              name:
                user.name ||
                decodeURIComponent(
                  key
                    .split("/")
                    .filter((el) => {
                      return el != null && el != "";
                    })
                    .pop()
                ),
              subscribed,
            });
          }

          if (destination == "user") {
            this.isFeedsModalVisible = true;
          }

          this.isLoadingFeeds = false;
        })
        .catch((err) => {
          console.log(err);
          this.isLoadingFeeds = false;
        });
    },
    saveSubscriptions() {
      //double JSON to remove direct store linked data (will update on success)
      const tempSettings = JSON.parse(JSON.stringify(this.settings));

      //Feeds that are not selected (for deletion)
      const notSubscribedFeeds = this.userFeeds.filter(
        (el) => el.subscribed == false
      );
      //Feeds that are selected (for insertion)
      const subscribedFeeds = this.userFeeds.filter(
        (el) => el.subscribed == true
      );

      //If a subscriptions settings don't exists initialize
      if (!tempSettings.subscriptions) {
        tempSettings.subscriptions = {};
      }

      // Add selected fields
      subscribedFeeds.forEach((feed) => {
        const feedData = this.urlToFeedData(feed.url);
        //if the feed owner is in the subscriptions
        if (typeof tempSettings.subscriptions[feedData.pod] !== "undefined") {
          // check if not already present
          if (
            !tempSettings.subscriptions[feedData.pod].filter(
              (el) => el.url == feedData.url
            ).length
          )
            tempSettings.subscriptions[feedData.pod].push(feedData);
          //else create the entry in the subscriptions field
        } else {
          tempSettings.subscriptions[feedData.pod] = [feedData];
        }
      });

      //Remove unsubscribed feeds from settings
      notSubscribedFeeds.forEach((feed) => {
        const feedData = this.urlToFeedData(feed.url);
        // if the feed's owner is present
        if (typeof tempSettings.subscriptions[feedData.pod] !== "undefined") {
          // check if feed is present
          const delIndex = tempSettings.subscriptions[feedData.pod].findIndex(
            (el) => el.url == feed.url
          );

          if (delIndex > -1)
            tempSettings.subscriptions[feedData.pod].splice(delIndex, 1);
        }
      });

      this.ibex
        .saveSettings(tempSettings)
        .then((res) => {
          //After save confirmation we can add the new settings to the store
          this.$store.commit("setSettings", res);

          //If the user is subscribing for the first time
          if (this.isSubscribeModalVisible) {
            //close the modal
            this.isSubscribeModalVisible = false;
          }

          //If the user is editing the subscriptions
          if (this.isSubscribeModalVisible) {
            //close the modal
            this.isFeedsModalVisible = false;
          }

          //Reload the settings
          Vue.checkSettings();
        })
        .catch((err) => console.log(err));
    },
    urlToFeedData(url) {
      //Split the url
      const data = url.split("/");

      const pod = "https://" + data[2];
      const name = decodeURIComponent(data[5]);

      return {
        pod,
        name,
        url: url,
      };
    },

    async copyWebID() {
      if (!navigator.clipboard) {
        return;
      }

      try {
        await navigator.clipboard.writeText(this.ibex.myHost);
      } catch (error) {
        console.error("copy failed", error);
      }
    },
  },
  async created() {
    const gotSession = await Vue.checkSession();

    if (gotSession) {
      const gotSettings = await Vue.checkSettings();
      if (gotSettings) {
        if (typeof this.settings.subscriptions !== "undefined") {
          for (let sub in this.settings.subscriptions) {
            const profile = await Vue.getUserProfile(sub);
            this.$store.commit('addUserToCache',profile);
          }
          this.$forceUpdate();
        }
      }
    }
  },
  mounted() {
    setPaymentPointer();
  },
};
</script>

<style>
</style>