const auth = require("solid-auth-client");

import { Ibex } from '../../ibex';

import store from '../../store';
import router from '../../router';

const hexRgb = require('hex-rgb');

export default {
    install(Vue, options) {

        Vue.checkSession = async function () {
            //check if there is a solid session
            let session = await auth.currentSession();

            if (session) {
                //set the ibex and session object in the store 
                store.commit("setIbex", new Ibex(session.webId));
                store.commit("setSession", session);
                //return true to allow further operations depending on the ibex istance
                return true;
            } else {
                //return to the login page as no solid session i currently present
                router.push("/");
                return false;
            }

        }

        Vue.checkSettings = async function () {
            //Get the contentent of the settings.json file
            const settings = await store.state.ibex.loadSettings()
            
            if(Object.keys(settings).length){
                //If content.json is not empty
                store.commit("setSettings",settings);
                return true;
            }else{
                //otherwise send the user to the onboarding process
                router.push("/onboarding/permissions");
                return false;
            }

        }

        Vue.getUserProfile = async function (url){
           
            let toFetch = false;

            if(url=='own'){
                // getting your own data occurs less so I don't "cache" it in store
                return await store.state.ibex.profile();
            }else{
                //Getting profile data of other users
                //checking if the data is in store
                if( typeof store.state.usersCache[url] !== 'undefined' ){
                    //check if it is expired
                    const now = new Date;
                    if(store.state.usersCache[url].expiration>now.getTime())
                        return store.state.usersCache[url];
                    else
                        toFetch = true;
                }else{
                    toFetch = true;
                }

                if(toFetch){
                    //get the user profile data
                    const urlDomain = store.state.ibex.urlDomain(url);
                   
                    const response = await store.state.ibex.willFetch(urlDomain + "/is.darcy/profile.json");
                    const profile = await response.json();

                    if(Object.keys(profile).length){
                        profile.url = urlDomain;
                        const now = new Date;
                        now.setHours(now.getHours() + 4);
                        profile.expiration = now.getTime();
                        store.commit('addUserToCache',profile);
                    }
                    return profile;
                }
            }

        }

        Vue.getFeedData = async function(url){



        }

        Vue.isColorLite = function(color){
            const colors = hexRgb(color);

            var a = 1 - (0.299 * colors.red + 0.587 * colors.green + 0.144 * colors.blue ) /255;

            return (a>0.5);
        }

    }
}

