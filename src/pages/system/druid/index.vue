<template>
  <div class="app-container fixed-none">
    <iframe class="druid-log" :src="baseURL" frameborder="0"></iframe>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'keep_druid',
  computed: {
    baseURL() {
      return `${process.env.BASE_API}/druid/index.html`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.druid-log
  width 100%
  height 100%
</style>
