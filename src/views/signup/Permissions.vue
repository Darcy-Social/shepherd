<template class="">
  <div class="bg-primary-200 flex flex-row items-center justify-center" style="height:100vh">
    <div class="flex flex-col items-center w-full">
      <img src="@/assets/img/permissions-blob.svg" style="width:55%" alt="Darcy Logo" />
      <h1 class="mb-2">Checking you permissions</h1>
         <img
          src="@/assets/img/loader.svg"
          class="animate-spin mx-auto mb-3"
        />
      <progressBar :value="currentIndex" min="0" :max="tests.length-1" />
      <span class="mt-2">{{currentTest.text}}</span>
    </div>
  </div>
</template>

<script>
import ProgressBar from "../../components/ProgessBar";

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
    interval: {},

    feedName:"",
    feedUrl:"",
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
          console.error(err);
        });
    },
    makePost() {
      this.ibex
        .createPost("Test Post", this.feedName)
        .then((res) => {
          console.log(res);
          this.postUrl = res.url;
          this.nextTest();
        })
        .catch((err) => {
          this.errors.push(err);
          console.log(err);
        });
    },
    makeComment() {},
    readPost(){
        this.ibex.willFetch(this.postUrl)
        .then(res=>{
            console.log(res);
            this.nextTest();
        })
        .catch(err=>{
            console.error(err);
        })
    },
    editPost() {
      this.ibex
        .willFetch(this.postUrl, {
          method: "PUT",
          body: "Post is changed",
          headers: { "Content-Type": "text/plain" },
        })
        .then((res) => {
          console.log(res);
          this.nextTest();
        })
        .catch((err) => {
          this.errors.push(err);
        });
    },
    deletePost(){
        this.ibex.delete(this.postUrl)
        .then(res=>{    
            this.postUrl = "";
            this.nextTest();
        })
        .catch(err=>{
            console.log(err);
            this.errors.push(err);
        });

    },
    deleteFeed(){
        this.ibex.deleteRecursive(this.feedUrl)
        .then(res=>{
            console.log(res);
            this.nextTest();
        })
        .catch(err=>{
            console.log(err);
        })
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
          this.$router.puhs("/onboarding/permissions/errors");
        }
      }
    },

  },
  created() {
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

    this.startTests()
  },
};
</script>

<style>
</style>