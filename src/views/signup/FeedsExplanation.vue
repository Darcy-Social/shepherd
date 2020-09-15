<template>
  <div class="bg-primary-200 flex flex-col items-center justify-around" style="height:100vh">

      <div class="flex flex-row blob bg-contain bg-center bg-no-repeat text-center w-full md:w-2/3 px-24 py-32" >

        <div class="w-1/2 flex flex-col justify-center">
            <img src="@/assets/img/public-person.svg" />
            <h2>Public Feeds</h2>
            Everybody can see what is in here. You can still set some boundaries
        </div>

        <div class="w-1/2 flex flex-col justify-center">
            <img src="@/assets/img/private-person.svg" />
            <h2>Private Feeds</h2>
            You choose who can see, comment and know about what is in here
        </div>
    </div>

      <router-link to="/onboarding/feeds/new" class="btn btn-primary">Understood!</router-link>

  </div>
</template>

<script>
export default {

}
</script>

<style lang="css" scoped>
    .blob{
        background-image: url('~@/assets/img/feed-explanation-blob.svg');
       
    }
</style>