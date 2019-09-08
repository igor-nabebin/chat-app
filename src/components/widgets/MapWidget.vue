<template>
  <div class="map-widget">
    <button class="map-close-btn" @click="$emit('close')">
      Close map
    </button>
    <GmapMap
      :center="{ lat, lng }"
      :zoom="14"
      :options="{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }"
      style="width: 380px; height: 200px; margin: 10px 0;"
    >
      <GmapMarker :position="{ lat, lng }" />
    </GmapMap>
  </div>
</template>

<script>
export default {
  name: "MapWidget",
  props: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.map-close-btn {
  background-image: linear-gradient(to bottom, #3093c7, #1c5a85);
  border: none;
  padding: 10px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  border-radius: 16px;
  margin-top: 10px;
}
</style>
