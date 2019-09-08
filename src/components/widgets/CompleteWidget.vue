<template>
  <div class="complete-widget">
    <p class="command-desc">Close conversation?</p>
    <button
      v-for="option in options"
      :key="option"
      @click="$emit('send', option)"
      class="command-btn"
    >
      {{ option }}
    </button>
  </div>
</template>

<script>
export default {
  name: "CompleteWidget",
  props: {
    options: {
      type: Array,
      required: true,
      validator: options => options.every(option => typeof option === "string")
    }
  }
};
</script>
