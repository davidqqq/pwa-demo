
<template>
  <div class="relative">
    <div
      v-if="(always||showTooltip)&&position==='center'"
      class="absolute mx-2 m-auto w-full right-0"
      style="top:-35px;min-width:50px"
    >
      <div class="bg-black text-white text-xs rounded py-1 px-4 right-0 bottom-full">
        <slot name="tooltip-content" />
        <svg
          class="absolute text-black h-2 w-full left-0 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
          xml:space="preserve"
        >
          <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
    <div @mouseover="showTooltip=true" @mouseleave="showTooltip=false">
      <slot />
    </div>
    <div v-if="(always||showTooltip)&&position==='top'" class="absolute mx-2">
      <slot name="tooltip-content" />
      <div class="bg-black text-white text-xs rounded py-1 px-4 right-0 bottom-full">
        <svg
          class="absolute text-black h-2 left-0 ml-3 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
          xml:space="preserve"
        >
          <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>

    <div v-if="(always||showTooltip)&&position==='right'" class="mx-2">
      <div class="absolute top-0 right-0 bg-black text-white text-xs rounded py-1 px-4">
        <slot name="tooltip-content" />
        <svg
          class="absolute text-black h-2 right-0 mr-3 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
          xml:space="preserve"
        >
          <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
  </div>
</template>


<script>
/**
 * HTML shamelessly copied from https://tailwindcomponents.com/component/tooltip
 * Credit to TonyCampa
 */
export default {
  name: "Tooltip",
  props: ["position", "always"],
  data() {
    return {
      showTooltip: false
    };
  }
};
</script>
<style>
.bottom-full {
  bottom: 100%;
}
.top-full {
  top: 100%;
}
</style>
