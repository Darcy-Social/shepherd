<template class="">
  <div
    class="bg-primary-200 flex flex-row items-center justify-center"
    style="height: 100vh"
  >
    <div class="flex flex-col items-center w-full">
      <img
        src="@/assets/img/permissions-blob.svg"
        style="width: 55%"
        alt="Darcy Logo"
      />
      <h1 class="mb-2">Checking your permissions</h1>
      <span>It might take a while to start</span>
      <img src="@/assets/img/loader.svg" class="animate-spin mx-auto mb-3" />
      <progressBar :value="currentIndex" min="0" :max="tests.length - 1" />
      <span class="mt-2">{{ currentTest.text }}</span>
    </div>
  </div>
</template>

<script>
import ProgressBar from "../../components/ProgessBar";
import { setPaymentPointer } from "../../webMonetization.js";

import Vue from "vue";

export default {
  name: "permissionCheck",
  components: {
    ProgressBar,
  },
  data: () => ({
    tests: [],
    errors: [],
    currentIndex: 0,
    currentTest: {},

    feedName: "",
    feedUrl: "",
    postUrl: "",
  }),
  computed: {
    ibex() {
      return this.$store.state.ibex;
    },
  },
  methods: {
    makeFeed() {
      this.feedName = Date.now();
      this.ibex
        .createFeed(this.feedName)
        .then((res) => {
          console.log(res);
          this.feedUrl = res.url;
          this.nextTest();
        })
        .catch((err) => {
          this.errors.push({
            step: "Creating a new feed",
            err,
          });
          console.error(err);
          this.nextTest();
        });
    },
    makePost() {
      console.info("Make post test -----")

      try{

      this.ibex
        .createPost("Test Post", this.feedName)
        .then((res) => {
          console.log(res);
          this.postUrl = res.url;
          this.nextTest();
        })
        .catch((err) => {
          this.errors.push({
            step: "Creating a new post",
            err,
          });
          console.log(err);
          this.nextTest();
        });

      }catch(e){
        console.info("catching make post")
        console.error(e);
      }
    },
    makeComment() {},
    readPost() {
      console.info("Read post test -----")
      this.ibex
        .willFetch(this.postUrl)
        .then((res) => {
          //console.log(res);
          this.nextTest();
        })
        .catch((err) => {
          this.errors.push({
            step: "Reading the created post",
            err,
          });
          console.error(err);
          this.nextTest();
        });
    },
    editPost() {
      console.info("Edit post test -----")
      this.ibex
        .willFetch(this.postUrl, {
          method: "PUT",
          body: "Post is changed",
          headers: { "Content-Type": "text/plain" },
        })
        .then((res) => {
          //console.log(res);
          this.nextTest();
        })
        .catch((err) => {
          this.errors.push({
            step: "Editing the created post",
            err,
          });
          this.nextTest();
        });
    },
    deletePost() {
      console.info("Delete post test -----")
      this.ibex
        .delete(this.postUrl)
        .then((res) => {
          this.postUrl = "";
          this.nextTest();
        })
        .catch((err) => {
          console.log(err);
          this.errors.push({
            step: "Deleting the post",
            err,
          });
          this.nextTest();
        });
    },
    deleteFeed() {
      console.info("Delete Feed test -----")

      this.ibex
        .deleteRecursive(this.feedUrl)
        .then((res) => {
          console.log("feed deletion res",res);
          this.nextTest();
        })
        .catch((err) => {
          this.errors.push({
            step: "Deleting the feed",
            err,
          });
          console.log("feed deletion error",err);
          this.nextTest();
        });
   
    },

    //------------------------------------

    startTests() {
      this.currentTest = this.tests[this.currentIndex];
      this.currentTest.method();
    },
    nextTest() {
      if (this.currentIndex < this.tests.length - 1) {
        this.currentIndex = this.currentIndex + 1;
        this.currentTest = this.tests[this.currentIndex];
        this.currentTest.method();
      } else {
        //Done with test
        if (!this.errors.length) {
          //No test errors - all good
          this.$router.push("/onboarding/permissions/success");
        } else {
          //Test errors
          this.$store.commit("setPermissionErrrors", this.errors);
          this.$router.push("/onboarding/permissions/errors");
        }
      }
    },
  },
  async created() {
    this.tests = [
      {
        text: "Creating a new feed",
        method: this.makeFeed,
      },
      {
        text: "Creating a new post",
        method: this.makePost,
      },
      // {
      //     text:"Creating a new comment",
      //     method:this.waitTest
      // },
      //   {
      //     text: "Accessing the feed",
      //     method: this.waitTest,
      //   },
      {
        text: "Reading the post",
        method: this.readPost,
      },
      // {
      //     text:"Reading the comment",
      //     method:this.waitTest
      // },
      // {
      //     text:"Editing the feed",
      //     method:this.waitTest
      // },
      {
        text: "Editing the post",
        method: this.editPost,
      },
      // {
      //     text:"Editing the comment",
      //     method:this.waitTest
      // },
      // {
      //     text:"Deleting the comment",
      //     method:this.waitTest
      // },
      {
        text: "Deleting the post",
        method: this.deletePost,
      },
      {
        text: "Deleting the feed",
        method: this.deleteFeed,
      },
    ];

    const gotSession = await Vue.checkSession();

    if (gotSession) this.startTests();
  },
  mounted() {
    setPaymentPointer();
  },
};
</script>

<style>
</style>