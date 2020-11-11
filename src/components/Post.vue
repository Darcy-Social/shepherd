<template>
<article class="flex flex-col shadow-md rounded-lg bg-white p-2 border border-gray-300 my-4">
    <header class="mb-2">
        <a @click="goToUser()"><b>{{(you)?'You':(user)?user.name:feedData.pod}}</b></a> - {{feedData.name}}<br/>
        <small>{{dateFromUrl.toLocaleString()}}</small>
    </header>
    <main class="">
        <img src="@/assets/img/loader.svg" class="animate-spin mx-auto " v-if="loadingContent" />
        {{postText}}
    </main>
    <footer>
        <button class="btn btn-primary" @click="goToPost()">See post</button>
    </footer>
</article>
</template>

<script>

import Vue from 'vue';

export default {
    name:"post",
    props:["post","you"],
    data:()=>({
        postText:"",
        loadingContent:false,
        user:false,
    }),
    methods:{
        fetchPost(){

            this.loadingContent = true;

            this.ibex.getText(this.post)
            .then(res=>{
                this.loadingContent = false;
                this.postText=res;
            })
            .catch(err=>{this.postText='Error fetching content'; console.error(err); this.loadingContent=false;});
        },
        goToPost(){
            this.$store.commit("setSelectedPost",this.post);
            this.$router.push("/post/");
        },
        goToUser(){
            this.$store.commit("setSelectedUser",this.feedData.pod);
            this.$router.push("/user");
        },
        
    },
    computed:{
        ibex(){
            return this.$store.state.ibex;
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
        },

    },
    async created(){
        this.fetchPost();

        const profile = await Vue.getUserProfile(this.post);
        this.user = profile;
    }
}
</script>

<style>

</style>