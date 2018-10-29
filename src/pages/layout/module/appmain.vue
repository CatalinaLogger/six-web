<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script type="text/ecmascript-6">
export default {
  computed: {
    cachedViews() {
      return this.$store.state.tags.cachedViews
    }
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.app-main
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px)
  position: relative
  overflow: hidden
</style>
