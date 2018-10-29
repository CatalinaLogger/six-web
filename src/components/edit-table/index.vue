<template>
  <div class="edit-table">
    <div class="touch-bar" v-if="edit">
      <el-button size="mini" plain @click="saveTable">
        <svg-icon icon-class="table-save"></svg-icon>保存
      </el-button>
      <el-button size="mini" plain @click="backTable">
        <svg-icon icon-class="table-back"></svg-icon>撤销
      </el-button>
      <el-button size="mini" :plain="!pickerType" @click="pickerRow" :type="pickerType">
        <svg-icon icon-class="table-picker"></svg-icon>{{pickerTip}}
      </el-button>
      <el-button size="mini" plain @click="appendRow">
        <svg-icon icon-class="table-append"></svg-icon>添加行
      </el-button>
      <el-button size="mini" plain @click="insertRow">
        <svg-icon icon-class="table-insert"></svg-icon>插入行
      </el-button>
      <el-button size="mini" plain @click="deleteRow">
        <svg-icon icon-class="table-delete"></svg-icon>删除行
      </el-button>
      <el-button size="mini" plain @click="upRow">
        <svg-icon icon-class="table-up"></svg-icon>上移
      </el-button>
      <el-button size="mini" plain @click="downRow">
        <svg-icon icon-class="table-down"></svg-icon>下移
      </el-button>
    </div>
    <el-table :data="list"
              @row-click="rowClick"
              :show-summary="showSummary"
              :summary-method="getSummaries"
              highlight-current-row
              border >
      <slot></slot>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    data: {
      type: Array,
      default: null
    },
    edit: {
      type: Boolean,
      default: true
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryMethod: {}
  },
  data() {
    return {
      init: [], // 原始数据
      list: [], // 编辑数据
      current: null, // 当前编辑行
      picker: null, // 复制行数据
      pickerTip: '复制行',
      pickerType: ''
    }
  },
  mounted() {
    this.init = this.data.map(v => {
      this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
      return v
    })
    Object.assign(this.list, this.init)
  },
  methods: {
    getSummaries(param) {
      return this.summaryMethod(param)
    },
    /** 点击行时触发编辑状态 */
    rowClick(row) {
      if (this.edit) {
        if (this.current) {
          this.current.edit = false
        }
        row.edit = true
        this.current = row
      }
    },
    saveTable() {
      if (this.current) {
        this.current.edit = false
      }
      this.init = []
      Object.assign(this.init, this.list)
    },
    backTable() {
      this.list = []
      Object.assign(this.list, this.init)
    },
    pickerRow() {
      if (this.picker) {
        this.picker = null
        this.pickerTip = '复制行'
        this.pickerType = ''
      } else if (this.current) {
        this.picker = {}
        Object.assign(this.picker, this.current)
        this.pickerTip = '已复制'
        this.pickerType = 'primary'
      } else {
        this.$message.error('请先选择需要复制的行')
      }
    },
    appendRow() {
      let newRow = {}
      if (this.current) {
        this.current.edit = false
      }
      if (this.picker) {
        Object.assign(newRow, this.picker)
      } else {
        newRow = {edit: true}
      }
      this.list.push(newRow)
      this.current = newRow
    },
    insertRow() {
      let newRow = {}
      let index = this.list.indexOf(this.current)
      if (this.current) {
        this.current.edit = false
      }
      if (this.picker) {
        Object.assign(newRow, this.picker)
      } else {
        newRow = {edit: true}
      }
      this.list.splice(index, 0, newRow)
      this.current = newRow
    },
    deleteRow() {
      this.list.splice(this.list.indexOf(this.current), 1)
      this.current = null
    },
    upRow() {
      let index = this.list.indexOf(this.current)
      if (index) {
        this.list.splice(index, 1)
        this.list.splice(index - 1, 0, this.current)
      }
    },
    downRow() {
      let index = this.list.indexOf(this.current)
      if (index < this.list.length) {
        this.list.splice(index, 1)
        this.list.splice(index + 1, 0, this.current)
      }
    }
  },
  watch: {
    list: {
      handler: function (val) {
        this.$emit('change', val)
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
