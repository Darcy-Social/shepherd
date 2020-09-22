<template>
<article class="flex flex-col shadow-md rounded-lg bg-white p-2 border border-gray-300 my-4">
    <header v-if="user" class="mb-2">
        <b>{{user.name}}</b><br/>
        <small>{{dateFromUrl.toLocaleString()}}</small>
    </header>
    <main class="">
    {{postText}}
    </main>
    <footer>

    </footer>
</article>
</template>

<script>
export default {
    name:"post",
    props:["post","user"],
    data:()=>({
        postText:"",
    }),
    methods:{
        fetchPost(){
            this.ibex.getText(this.post)
            .then(res=>{
                console.log(res);
                this.postText=res;
            })
            .catch(err=>this.postText='Error fetching content');
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

            
        }
    },
    created(){
        this.fetchPost();
    }
}
</script>

<style>

</style>