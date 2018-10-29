<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Navbar, Sidebar, TagsView, AppMain } from './module'

export default {
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  components: {
    Navbar,
    Sidebar,
    TagsView,
    AppMain
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin"
.app-wrapper
  @include clearfix
  position relative
  height 100%
  width 100%
  .sidebar-container
    background #304156
</style>
