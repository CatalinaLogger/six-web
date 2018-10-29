<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Login from '@/pages/login/index'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'notice'
    ])
  },
  watch: {
    notice(val) {
      if (val.code === 'online') {
        this.$notify({
          title: '上线通知',
          message: val.data,
          type: 'success'
        })
      }
    }
  },
  components: {
    Login
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
