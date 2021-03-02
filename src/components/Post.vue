<template>
<div>
<article class="flex flex-col shadow-md rounded-lg bg-white p-2 border border-gray-300 my-4">
    <header class="mb-2 flex flex-row justify-between">
        <aside>
            <a @click="goToUser()"><b>{{(you)?'You':(user)?user.name:feedData.pod}}</b></a> - {{feedData.name}}<br/>
            <small>{{dateFromUrl.toLocaleString()}}</small>
        </aside>
        <button v-if="you" aria-label="Delete Post" title="Delete Post" @click="showDeleteModal=true" ><img src="@/assets/img/x.svg" /></button>
    </header>
    <main class="">
        <img src="@/assets/img/loader.svg" class="animate-spin mx-auto " v-if="loadingContent" />
        {{postText}}
    </main>
    <footer>
        <button class="btn btn-primary" @click="goToPost()">See post</button>
    </footer>
</article>

<Modal title="Do you really want to delete this post?" v-show="showDeleteModal">
    <template v-slot:body @close="showDeleteModal=false" >
        <div class="flex flex-col items-center">
            <img src="@/assets/img/alert-triangle.svg" class="w-1/5" />
            <h2>You will not be able recover<br/> this post after you delete it!</h2>
        </div>
    </template>
    <template v-slot:footer>
        <div class="flex flex-row justify-center">
            <button class="btn btn-red mr-3 inline-block"  @click="$emit('deletePost')">Confirm</button>
            <button class="btn btn-gray inline-block" @click="showDeleteModal=false">Cancel</button>
        </div>
    </template>
</Modal>
</div>
</template>

<script>

import Vue from 'vue';
import Modal from '../components/Modal';

export default {
    name:"post",
    props:["post","you"],
    components:{
        Modal,
    },
    data:()=>({
        postText:"",
        loadingContent:false,
        user:false,
        showDeleteModal:false,
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