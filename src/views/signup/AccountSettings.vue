<template>
<transition name="slide-left">

  <div class="flex flex-row accountSettings">
    <div class="w-1/2 flex flex-col justify-center items-center px-4">
      <h2>Who can see your profile?</h2>
      <div>
        <div class="flex flex-row text-sm">
          <div class="mx-4 w-1/3 text-left">Nobody</div>
          <div class="mx-4 w-1/3 text-center">People you follow</div>
          <div class="mx-4 w-1/3 text-right">Everyone in the world</div>
        </div>
        <input type="range" step="1" min="1" max="3" v-model="profileVisibility" />
      </div>

      <h2>Who can see your posts?</h2>

      <div>
        <div class="flex flex-row text-sm">
          <div class="mx-4 w-1/3 text-left">Nobody</div>
          <div class="mx-4 w-1/3 text-center">People you follow</div>
          <div class="mx-4 w-1/3 text-right">Everyone in the world</div>
        </div>
        <input type="range" step="1" min="1" max="3" v-model="postVisibility" />
      </div>

      <h2>Who can comment on your posts?</h2>

      <div>
        <div class="flex flex-row text-sm">
          <div class="mx-4 w-1/3 text-left">Nobody</div>
          <div class="mx-4 w-1/3 text-center">People you follow</div>
          <div class="mx-4 w-1/3 text-right">Everyone in the world</div>
        </div>
        <input type="range" step="1" min="1" max="3" v-model="commentPermissions" />
      </div>

      <button class="btn btn-primary mt-5">Configure my account!</button>
    </div>
    <div
      class="w-1/2 skewed text-white text-center flex flex-col justify-center items-center bg-no-repeat bg-contain bg-right"
      :style="{backgroundImage:'url('+require('@/assets/img/skewed-r.svg')+')'}"
    >
      <img src="@/assets/img/sliders.svg" class="w-1/4 mb-4" alt="Darcy comment bubble logo" />
      <h1 class="w-2/3 my-6">
        Fine tune your
        privacy settings
      </h1>Or just click continue if it looks right
      <br />You can change these options anytime
    </div>
  </div>
</transition>
</template>

<script>
export default {
  data: () => ({
    profileVisibility: 0,
    postVisibility: 0,
    commentPermissions: 0
  }),
  methods: {},
  created() {}
};
</script>

<style scoped>
.accountSettings > div {
  height: 100vh;
}

input[type=range] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type=range]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type=range]::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent; 
  border-color: transparent;
  color: transparent;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 25px;
  width: 25px;
    border:none;

  border-radius: 100%;
  background: #3071a9;
  cursor: pointer;
  margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
}

/* All the same stuff for Firefox */
input[type=range]::-moz-range-thumb {
  height: 25px;
  width: 25px;
  border:none;
  border-radius: 100%;
  background: #3071a9;
  cursor: pointer;
}

/* All the same stuff for IE */
input[type=range]::-ms-thumb {
  height: 25px;
  width: 25px;
    border:none;

  border-radius: 100%;
  background: #3071a9;
  cursor: pointer;
}




input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  background: #C9C9C9;
  border-radius: 10px;
  border: 0.2px solid #010101;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  background: #C9C9C9;
}

input[type=range]::-moz-range-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  background: #C9C9C9;
  border-radius: 10px;
}

input[type=range]::-ms-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #C9C9C9;
  border-radius: 10px;
}
input[type=range]:focus::-ms-fill-lower {
  background: #C9C9C9;
}
input[type=range]::-ms-fill-upper {
  background: #C9C9C9;
  border-radius:10px;
}
input[type=range]:focus::-ms-fill-upper {
  background: #C9C9C9;
}
</style>