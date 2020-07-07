<template>
  <a
    href="#"
    class=" block w-full p-2 flex rounded-md flex-row justify-between content-center text-left my-4 cursor-pointer"
    :class="{'bg-primary-100':active}"
    @click="setValue()"
  >
    <div class="indicator bg-gray-400 rounded-full p-3 self-center">
      <div class="rounded-full p-2" :class="{'bg-primary-500':active,' bg-gray-400':!active}"></div>
    </div>
    <img :src="icon" class="w-20 ml-4 inline-block" />
    <div class="w-full px-4">
      <h2>{{title}}</h2>
      {{text}}
    </div>
  </a>
</template>

<script>
export default {
  props: ["icon", "value", "title", "text",'active'],
  methods: {
    setValue() {
      this.$emit("setValue", this.value);
    }
  }
};
</script>

<style scoped>
.indicator {
}
</style>