<template>
  <div>
    <Sidebar />

    <main class="main px-2">
      <h2 class="inline-block">Your Public Feeds</h2>
      <button class="btn btn-primary" @click="showNewFeedModal = true">
        Create Feed
      </button>

      <article
        v-for="feed in publicFeeds"
        :key="feed.url"
        class="flex flex-row justify-between items-center shadow-md rounded-lg bg-white p-2 border border-gray-300 my-3"
      >
        {{ feed.name }} 

        <button class="btn btn-orange text-white" @click="feedToDelete=feed.url;showDeleteModal=true;"><img src="@/assets/img/x.svg" /></button>      
      </article>
    </main>

    <Modal v-show="showNewFeedModal" title="Create new Feed">
      <template v-slot:body>
        <FormGroup label="Feed Name" type="text" v-model="newFeedName" />
      </template>

      <template v-slot:footer>
        <div class="flex flex-row justify-center items-center">
          <button class="btn btn-gray mr-3" @click="showNewFeedModal = false">
            Cancel
          </button>
          <button class="btn btn-primary" @click="createPublicFeed()">
            Save
          </button>
        </div>
      </template>
    </Modal>

     <Modal v-show="showDeleteModal" title="Confirm Feed Deletion?">
        <h1>Confirm the deletion of the feed</h1>
        You will also lose all the feed's content!

      <template v-slot:footer>
        <div class="flex flex-row justify-center items-center">
          <button class="btn btn-gray mr-3" @click="showDeleteModal = false;feedToDelete='';">
            Cancel
          </button>
          <button class="btn btn-orange" @click="deletePublicFeed(feedToDelete)">
            Delete
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

export default {
  components: {
    Sidebar,
    Modal,
    FormGroup,
  },
  data: () => ({
    newFeedName: "",
    showNewFeedModal: false,
    showDeleteModal:false,
    feedToDelete:"",
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
          console.log(res);
          this.$store.commit("setPublicFeeds", res);
        })
        .catch((err) => console.log(err));
    },
    createPublicFeed() {
      if (this.newFeedName.length) {
        this.ibex
          .createFeed(this.newFeedName)
          .then((res) => {
            console.log(res);

            this.newFeedName = "";
            this.showNewFeedModal = false;

            this.getPublicFeeds();
          })
          .catch((err) => {
            console.error(err);
            this.showNewFeedModal = false;
            alert("Sorry no feed created!");
          });
      }
    },
    deletePublicFeed(url) {
      this.ibex
        .deleteRecursive(url)
        .then((res) => {
          console.log(res);
          this.getPublicFeeds()
        })
        .catch((err) => {
          console.error(err);
          alert("Error deleting feed");
        });
    },
  },
  created() {
    this.getPublicFeeds();
  },
};
</script>

<style>
</style>