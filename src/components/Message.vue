<template>
 <transition name="fade">
  <div :class="classes" class="p-2 rounded-md">
      <div class="flex flex-row">
          <div class="w-11/12">
             <b v-if="title.length" class="block">{{title}}</b>
          </div>
          <div class="w-1/12 text-right">
            <button @click="$emit('removeMessage')"><img src="@/assets/img/x.svg"/></button>
          </div>    
      </div>
     
      {{message}}
  </div>
 </transition>
</template>

<script>
export default {
    props:{
        //How long will the message stay visible in ms (ignored if permanent)
        duration:{
            type:Number,
            default:3000
        },
        //If the message will disappear or stay until dismissed by the user
        permanent:{
            type:Boolean,
            default:false
        },
        //Color of the border, background and text
        color:{
            type:String,
            default:"primary"
        },
        //Title at the top of the message (optional)
        title:String,
        //Message to display
        message:String,
    },
    data:()=>({
        timer:{},
    }),
    computed:{
        classes(){
            return `bg-${this.color}-200 border-${this.color}-700 text-${this.color}-700`;
        }
    },
    methods:{
    },
    created(){

        if(!this.permanent){
            this.timer = setTimeout(()=>{this.$emit('removeMessage')},this.duration)
        }

    }
}
</script>

<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
</style>