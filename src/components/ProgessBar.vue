<template>
<div>
    <progress :min="min" :max="max" :value="value" class="">
    </progress>
</div>
</template>

<script>
export default {
    name:"progressBar",
    props:[
        "value",
        "max",
        "min"
    ],
    methods:{

    }
}
</script>

<style lang="css">

progress {
    max-width: 100%;
    width:400px;
	height: 10px;
	display: block;
	/* Important Thing */
	-webkit-appearance: none;
    border: none;
    @apply rounded-full;
}

progress::-webkit-progress-bar {
	background: white;
	@apply rounded-full;
}

progress::-webkit-progress-value {
    @apply bg-primary-500;
    @apply rounded-full;
	/* Looks great, now animating it */
	background-size: 25px 14px, 100% 100%, 100% 100%;
	-webkit-animation: move 5s linear 0 infinite;
}

progress[value] {
  /* Reset the default appearance */
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  background: white;
  border: none;
  max-width: 100%;
  width:400px;
  height: 10px;
}

progress[value]::-moz-progress-bar { 
  @apply bg-primary-500;
  @apply rounded-full;    
}



</style>