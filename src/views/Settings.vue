<template>
  <div>
    <Sidebar />

    <main class="main px-2">
      <h2 class="inline-block">Your Public Feeds</h2>
      <button class="btn btn-primary" @click="showNewFeedModal = true">
        Create Feed
      </button>

      <Message v-for="message in messages" :color="message.color" class="mt-2" :key="message.id" :title="message.title" :message="message.message" @removeMessage="dismissMessage(message)" :duration="5000"/>

      <article
        v-for="feed in publicFeeds"
        :key="feed.url"
        class="flex flex-row justify-between items-center shadow-md rounded-lg bg-white p-2 border border-gray-300 my-3"
      >
        <span
          :style="{ backgroundColor: feed.color }"
          class="px-4 py-1 rounded-full"
          :class="{ 'text-white': feed.textIsLite }"
          >{{ feed.name }}
        </span>

        <div class="flex flex-row">
          <button class="btn btn-primary mr-2" @click="doShowEditModal(feed)">Edit</button>
          <button
            class="btn btn-red text-white"
            @click="
              feedToDelete = feed.url;
              showDeleteModal = true;
            "
          >
            Delete
          </button>
        </div>
      </article>
    </main>

    <Modal v-show="showNewFeedModal" title="Create new Feed">
      <template v-slot:body>
        <div class="flex flex-row justify-around items-end">
          <FormGroup label="Feed Name" type="text" v-model="newFeedName" />
          <FormGroup
            type="color"
            label="color"
            v-model="newFeedColor"
            class="mx-2"
          />
        </div>
      </template>

      <template v-slot:footer>
        <div class="flex flex-row justify-center items-center">
          <button class="btn btn-gray mr-3" @click="showNewFeedModal = false" :disabled="isSaving">
            Cancel
          </button>
          <button class="btn btn-primary" @click="createPublicFeed()" :disabled="isSaving">
            <img
              src="@/assets/img/loader.svg"
              class="animate-spin mr-2"
              style="
                line {
                  stroke: white;
                }
              "
              v-if="isSaving"
            />
            {{ isSaving ? "Saving" : "Save" }}
          </button>
        </div>
      </template>
    </Modal>

    <Modal
      v-show="showDeleteModal"
      @close="showDeleteModal = false"
      title="Confirm Feed Deletion?"
    >
      <h1>Confirm the deletion of the feed</h1>
      You will also lose all the feed's content!

      <template v-slot:footer>
        <div class="flex flex-row justify-center items-center">
          <button
            class="btn btn-gray mr-3"
            @click="
              showDeleteModal = false;
              feedToDelete = '';
            "
          >
            Cancel
          </button>
          <button
            :disabled="isDeleting"
            class="btn btn-orange"
            @click="deletePublicFeed(feedToDelete)"
          >
            <img
              src="@/assets/img/loader.svg"
              class="animate-spin mr-2"
              style="line{stroke:white}"
              v-if="isDeleting"
            />
            {{(isDeleting)?'Deleting..':'Delete'}}
          </button>
        </div>
      </template>
    </Modal>

    <Modal title="Edit Feed" @close="hideEditModal()" v-show="showEditModal">
      <template v-slot:body>
        <div class="flex flex-row justify-around items-end">
          <!-- <FormGroup label="Feed Name" type="text" v-model="selectedFeed.name" /> -->
          <FormGroup
            type="color"
            label="color"
            v-model="selectedFeed.color"
            class="mx-2"
          />
        </div>
      </template>
      <template v-slot:footer>
       <div class="flex flex-row justify-center items-center">
          <button class="btn btn-gray mr-3" @click="hideEditModal()" :disabled="isSaving">
            Cancel
          </button>
          <button class="btn btn-primary" @click="editFeed()" :disabled="isSaving">
            <img
              src="@/assets/img/loader.svg"
              class="animate-spin mr-2"
              style="
                line {
                  stroke: white;
                }
              "
              v-if="isSaving"
            />
            {{ isSaving ? "Saving" : "Save" }}
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
import Message from '../components/Message';

import Vue from "vue";

export default {
  components: {
    Sidebar,
    Modal,
    FormGroup,
    Message,
  },
  data: () => ({
    newFeedName: "",
    newFeedColor: "#000000",
    showNewFeedModal: false,
    showDeleteModal: false,
    showEditModal:false,
    feedToDelete: "",
    isSaving:false,
    isDeleting:false,
    selectedFeed:{name:"",color:"#000000"},
    messages:[],
  }),
  computed: {
    ibex() {
      return this.$store.state.ibex;
    },
    publicFeeds() {
      return this.$store.state.publicFeeds;
    },
  },
  methods: {
    getPublicFeeds() {
      this.ibex
        .manifest()
        .then((res) => {
          //console.log(res);
          this.$store.commit("setPublicFeeds", res);
        })
        .catch((err) => console.log(err));
    },
    createPublicFeed() {
      this.isSaving = true;
      if (this.newFeedName.length) {
        this.ibex
          .createFeed(this.newFeedName, this.newFeedColor)
          .then((res) => {
            //console.log(res);

            this.newFeedName = "";
            this.newFeedColor = "#000000";
            this.showNewFeedModal = false;

            this.isSaving = false;
            this.getPublicFeeds();
          })
          .catch((err) => {
            console.error(err);
            this.isSaving = false;
            this.showNewFeedModal = false;
            alert("Sorry no feed created!");
          });
      }
    },
    deletePublicFeed(url) {
      this.isDeleting = true;
      this.ibex
        .deleteRecursive(url)
        .then((res) => {
          this.isDeleting = false;
          this.getPublicFeeds();
          this.showDeleteModal = false;
        })
        .catch((err) => {
          console.error(err);
          this.isDeleting = false;
          alert("Error deleting feed");
          this.showDeleteModal = false;
        });
    },
    doShowEditModal(feed){
      console.log(feed);
      this.showEditModal = true;
      this.selectedFeed = feed;
    },
    hideEditModal(){
      this.showEditModal = false;
      this.selectedFeed = {name:"",color:"#000000"}
    },
    editFeed(){
      this.isSaving = true;
      this.ibex.manifest()
      .then(manifest=>{
        if(typeof manifest[this.selectedFeed.url] !== 'undefined'){
          manifest[this.selectedFeed.url].color = this.selectedFeed.color;

          this.ibex.saveManifest(manifest)
          .then(res=>{
            this.hideEditModal();
            this.messages.push({
              id:"e"+new Date().valueOf(),
              title:"Feed Updated!",
              message:"Feed update successfully",
              color:"primary"
            });
            this.getPublicFeeds();
            this.isSaving = false;
          })
          .catch(err=>{
            console.error(err);
            this.messages.push({
              id:"e"+new Date().valueOf(),
              title:"Error while updating feed",
              message:err,
              color:"red"
            });
            this.isSaving = false;
          })

        }
      })
      .catch(err=>{
        console.error(err);
      })
    },

    dismissMessage(message){
      //console.info(id)
      this.messages.splice(message);
    },
  },
  async created() {
    const gotSession = await Vue.checkSession();
    if (gotSession) this.getPublicFeeds();
  },
};
</script>

<style>
</style>