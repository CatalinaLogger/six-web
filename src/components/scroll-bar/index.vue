<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll" >
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    delta: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      top: 0
    }
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerHeight = $container.offsetHeight
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperHeight = $wrapper.offsetHeight
      if (eventDelta > 0) {
        this.top = Math.min(0, this.top + eventDelta)
      } else {
        if ($containerHeight - this.delta < $wrapperHeight) {
          if (this.top < -($wrapperHeight - $containerHeight + this.delta)) {
            this.top = this.top
          } else {
            this.top = Math.max(this.top + eventDelta, $containerHeight - $wrapperHeight - this.delta)
          }
        } else {
          this.top = 0
        }
      }
    }
  },
  watch: {
    list() {
      this.top = 0
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variables'

.scroll-container
  position relative
  width 100%
  height 100%
  .scroll-wrapper
    position absolute
    width 100% !important
</style>
