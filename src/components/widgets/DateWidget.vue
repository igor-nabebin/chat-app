<template>
  <div class="date-widget">
    <p class="command-desc">Please select the day:</p>
    <button
      v-for="day in allDays"
      :key="day"
      @click="$emit('send', day)"
      class="command-btn"
    >
      {{ day }}
    </button>
  </div>
</template>

<script>
import { format, addDays } from "date-fns";

export default {
  name: "DateWidget",
  props: {
    date: {
      type: String,
      required: true,
      validator: date => !Number.isNaN(Number(new Date(date)))
    }
  },
  computed: {
    allDays() {
      // Generating the 7 elements long array of days from the command.data date
      let currentDate = new Date(this.date);
      const datesArray = [];
      while (datesArray.length < 7) {
        datesArray.push(format(currentDate, "cccc"));
        currentDate = addDays(currentDate, 1);
      }
      return datesArray;
    }
  }
};
</script>
