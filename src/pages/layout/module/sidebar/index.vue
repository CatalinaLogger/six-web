<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <menu-item :routes="allRouters"></menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script type="text/ecmascript-6">
import MenuItem from './menu'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'allRouters',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    allRouters(val) {
      console.log(val)
    }
  },
  components: {
    MenuItem
  }
}
</script>
