<template>
  <div :value="value">
    <my-upload field="file"
               @crop-success="cropSuccess"
               @crop-upload-success="cropUploadSuccess"
               v-model="isShow"
               :width="300"
               :height="300"
               :url="url"
               :params="params"
               :headers="headers"
               img-format="png"
               ref="myUpload">
    </my-upload>
  </div>
</template>

<script type="text/ecmascript-6">
import MyUpload from 'vue-image-crop-upload'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: null
    },
    headers: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isShow: false,
      imgDataUrl: ''
    }
  },
  methods: {
    /** 图片截取完成事件 */
    cropSuccess(imgDataUrl) {
      this.imgDataUrl = imgDataUrl
    },
    /** 处理上传结果，此处有修改源码 */
    cropUploadSuccess(jsonData) {
      if (jsonData.code > 0) {
        this.$refs.myUpload.setSuccess()
        this.$emit('upload-success')
      } else {
        this.$refs.myUpload.setFail(jsonData.msg)
      }
    }
  },
  watch: {
    value(val) {
      this.isShow = val
    },
    isShow(val) {
      this.$emit('input', val)
    }
  },
  components: {
    MyUpload
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
