<template>
  <div class="rate-widget">
    <p class="command-desc">Please rate your experience:</p>
    <button
      v-for="rating in allRates"
      :key="rating"
      @click="$emit('send', rating)"
      class="command-btn"
    >
      {{ rating }}
    </button>
  </div>
</template>

<script>
export default {
  name: "RateWidget",
  props: {
    fromRate: {
      type: Number,
      required: true
    },
    toRate: {
      type: Number,
      required: true
    }
  },
  computed: {
    allRates() {
      const result = [];
      for (let i = this.fromRate; i <= this.toRate; i++) {
        result.push(i);
      }
      return result;
    }
  }
};
</script>
