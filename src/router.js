import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Register from './views/Register.vue'
import RegisterSuccess from './views/signup/RegisterSuccess.vue'
import Feed from './views/Feed.vue'

import Permissions from './views/signup/Permissions.vue'
import PermissionsSuccess from './views/signup/PermissionsSuccess';
import PermissionsErrors from './views/signup/PermissionsErrors';
import FeedsExplanation from './views/signup/FeedsExplanation';
import FeedsCreation from './views/signup/FeedsCreation';
import OnboardingProfile from './views/signup/Profile';
import OnboardingSuccess from './views/signup/Success';

import Following from './views/Following';
import User from './views/User';
import Settings from './views/Settings';
import SinglePost from './views/SinglePost';
import Profile from './views/Profile';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
   
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/register/success",
      name: "registerSuccess",
      component: RegisterSuccess,
    },
    {
      path:"/feed",
      name:"feed",
      component: Feed
    },
    {
      path:"/profile",
      name:"profile",
      component:Profile,
    },
    {
      path:"/onboarding/permissions",
      name:"onboardingPermissions",
      component: Permissions
    },{
      path:"/onboarding/permissions/success",
      name:"onboardingPermissionsSuccess",
      component:PermissionsSuccess,
    },{
      path:"/onboarding/permissions/errors",
      name:"onboardingPermissionsErrors",
      component:PermissionsErrors,
    },{
      path:"/onboarding/feeds/",
      name:"onboardingFeeds",
      component: FeedsExplanation,
    },{
      path:"/onboarding/feeds/new",
      name:"onboardinFeedCreation",
      component: FeedsCreation,
    },{
      path:"/onboarding/profile",
      name:"onboardingProfile",
      component: OnboardingProfile,
    },
    {
      path:"/onboarding/success",
      name:"onboardingSuccess",
      component: OnboardingSuccess,
    },

    {
      path:"/following",
      name:"following",
      component:Following,
    },
    {
      path:"/user",
      name:"user",
      component:User,
    },
    {
      path:"/settings",
      name:"settings",
      component:Settings
    },{
      path:"/post/",
      name:"postView",
      component:SinglePost,
    }
  ]
})
