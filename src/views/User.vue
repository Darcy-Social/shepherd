<template>
<div>

    <Sidebar />

    <main class="main px-2">
        {{user}}

        <button class="btn btn-primary" @click="loadPosts()">Load 📰</button>

        <Post :user="user" :post="post" v-for="post in posts" :key="post" />
    </main>
    
</div>
</template>

<script>

import Sidebar from '../components/Sidebar';
import Post from '../components/Post';
import { FeedLoader } from "../ibex.js";

export default {
    name:"UserView",
    components:{
        Sidebar,
        Post
    },
    data:()=>({
        feedLoader:{},
    }),
    computed:{
        user(){
            return this.$store.state.currentUser;
        },
        ibex(){
            return this.$store.state.ibex;
        },
        posts(){
            return this.feedLoader.myPosts;
        }
    },
    methods:{
        loadPosts(){
            this.feedLoader = new FeedLoader(this.user.value+"is.darcy/feed/cats/");
            this.feedLoader.load()
            .then(res=>{
                console.log(res);
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },
    created(){
        this.loadPosts();
    }   
}
</script>

<style>

</style>