<template>
  <div>

    <Sidebar />

    <main class="main px-2">

        <FormGroup class="mb-4" type="text" label="Filter" v-model="filterText" />

        <article 
        v-for="user in filteredUsers" :key="user.webId"
        class="flex flex-row justify-start items-center shadow-md rounded-lg bg-white p-2 border border-gray-300 my-3"
        >    
            <div 
            class="w-12 h-12 mr-4 border border-gray-300 rounded-full p-1 bg-cover bg-no-repeat bg-center" 
            :style="{backgroundImage:'url(\''+user.image+'\')'}"
            >
                
            </div>
            <div @click="goToUser(user)" class="cursor-pointer">
                <b>{{user.name}}</b><br/>
                <small v-if="user.name!=user.webId">{{user.webId}}</small>
            </div>
            <div class="">
                <!-- <span 
                class="text-white rounded-full mx-2 text-sm border-4 border-opacity-0 border-black py-1 px-4" 
                v-for="feed in user.feeds.public" :key="feed.name"
                :style="{backgroundColor:feed.color}"
                >{{feed.name}}</span>

                 <span 
                 class="text-white rounded-full mx-2 text-sm border-4 border-dashed border-opacity-50 border-black py-1 px-4" 
                 :style="{backgroundColor:feed.color}"
                 v-for="feed in user.feeds.private" :key="feed.name"
                 >{{feed.name}}</span> -->
            </div>
            
        </article>

         <FormGroup label="Toggle Demo" type="toggle" v-model="toggle" />

    </main>

   

  </div>

</template>

<script>

import Sidebar from '../components/Sidebar';
import FormGroup from '../components/FormGroup';

const $rdf = require('rdflib');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

export default {
    name:"FollowingView",
    components:{
        Sidebar,
        FormGroup
    },
    data:()=>({
        filterText:"",
        users:[]
    }),
    computed:{
        filteredUsers(){
            if(this.filterText.length){
                return this.users.filter(el=>el.name.toLowerCase().indexOf(this.filterText.toLowerCase())!=-1);
            }else{
                return this.users;
            }
        },
        ibex(){
            return this.$store.state.ibex;
        }
    },
    methods:{
        goToUser(user){
            this.$store.state.currentUser = user;
            this.$router.push("/user");
        },
        getUsers(){
            this.ibex.listFriends(this.$store.state.session.webId)
            .then(res=>{

                var friends = [];

                res.forEach(friend=>{

                    const store = $rdf.graph();
                    const fetcher = new $rdf.Fetcher(store);
                    fetcher.load(friend)
                    .then(()=>{

                        const fullName = store.any($rdf.sym(friend.value), FOAF('name'))
                        const image = store.any($rdf.sym(friend.value), VCARD('hasPhoto'));

                        friends.push({
                            name: (fullName)? fullName.value : friend.value,
                            webId: friend.value,
                            image: (image)? decodeURI(image.value) : require("@/assets/img/default-user.svg"),
                        });

                    });

                });

                this.users = friends;
            })
        }
    },
    created(){
        this.getUsers();
    }
}
</script>

<style>

</style>