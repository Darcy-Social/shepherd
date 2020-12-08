import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ibex:{},
    session:{},
    settings:{},
    publicFeeds:[],
    selectedPost:"",
    selectedUser:"",
    usersCache:{},

    //onboarding data
    permissionErrors:[],
    createdPublicFeeds:[],
  },
  mutations: {
    setSettings(state,settings){
      state.settings = settings;
    },
    setSession(state,session){
      state.session = session;
    },

    setIbex(state,ibex){
      state.ibex = ibex;
    },
    setPublicFeeds(state,feeds){
      
      let betterFeeds = [];

      for(const key in feeds){

        const data = key.split("/");

        const pod = "https://"+data[2];
        const name = decodeURIComponent(data[5]);
        const color = feeds[key].color || '#000000';

        betterFeeds.push({
            pod,
            name,
            color,
            textIsLite: Vue.isColorLite(color),
            url:key
        });

      }

      state.publicFeeds = betterFeeds;
    },
    setSelectedPost(state,post){
      state.selectedPost = post;
    },
    setSelectedUser(state,user){
      state.selectedUser = user;
    },
    addUserToCache(state,user){
      state.usersCache[user.url] = user;
    },


    //onboarding

    setPermissionErrrors(state,errors){
      state.permissionErrors = errors;
    },
    setCreatedPublicFeeds(state,feeds){
      state.createdPublicFeeds = feeds;
    }
 
  },
  actions: {
  
  }
})
