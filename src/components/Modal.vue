<template>
  <transition name="modal-fade">
    <div
      class="modal-bg w-screen bg-black bg-opacity-50 z-0 fixed top-0 left-0 flex flex-row justify-center items-center"
    >
      <div class="modal absolute rounded-md p-2 bg-white flex flex-col z-10" role="dialog" aria-labelledby="modalTitle"
        aria-describedby="modalDescription">
        <header class="flex flex-row justify-between content-center pb-3" id="modalTitle">
          <b>{{ title }}</b>
          <button type="button" class="" @click="close">
              <img src="@/assets/img/x.svg" />
          </button>
        </header>

        <section id="modalDescription" class="py-1">
          <slot name="body"></slot>
        </section>

        <footer class="pt-3">
          <slot name="footer"> </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "modal",
  props: ["title"],
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style>
    .modal-fade-enter,
    .modal-fade-leave-active {
    opacity: 0;
    }

    .modal-fade-enter-active,
    .modal-fade-leave-active {
    transition: opacity 0.5s ease;
    }

    .modal-bg{
        height: 100vh !important;
    }
</style>