<template>
  <div class="app-container fixed-none">
    <iframe class="flow-model" :src="baseURL" frameborder="0"></iframe>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'keep_model',
  computed: {
    baseURL() {
      return `${process.env.BASE_API}/models/index.html`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.flow-model
  width 100%
  height 100%
</style>
