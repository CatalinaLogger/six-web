<template>
  <div class="approve-panel" v-if="taskList.length > 0">
    <el-row class="history-header">
      <el-col :span="4">任务名称</el-col>
      <el-col :span="8">处理意见</el-col>
      <el-col :span="4">处理结果</el-col>
      <el-col :span="4">处理人员</el-col>
      <el-col :span="4">处理时间</el-col>
    </el-row>
    <el-row class="history-center" type="flex" justify="center" v-for="task in taskList" :key="task.id">
      <el-col :span="4">{{task.name}}</el-col>
      <el-col :span="8">{{task.taskNote}}</el-col>
      <el-col :span="4">{{task.taskName}}</el-col>
      <el-col :span="4">{{task.handelUser}}</el-col>
      <el-col :span="4">{{task.endTime}}</el-col>
    </el-row>
    <slot>
      <el-row class="handel-center" type="flex" justify="center" v-if="!readOnly">
        <el-col :span="24">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2}"
            :rows="2"
            placeholder="请输入处理意见"
            v-model="taskNote">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="handel-button" type="flex" justify="center" v-if="!readOnly && formKey !== 'a'">
        <el-col :span="24">
            <el-button type="info" icon="el-icon-info" @click="closeClick">暂不处理</el-button>
            <el-button type="danger" icon="el-icon-error" @click="handelResolve({taskCode: -1, taskName: '驳回申请', message: '请确认是否驳回申请，点击确定后将不可修改！'})">驳回申请</el-button>
            <el-button type="success" icon="el-icon-success" @click="handelResolve({taskCode: 1, taskName: '同意申请', message: '请确认是否同意申请，点击确定后将不可修改！'})">同意申请</el-button>
        </el-col>
      </el-row>
    </slot>
  </div>
</template>

<script type="text/ecmascript-6">
import { getTaskList } from '@/api/flow'
export default {
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    formKey: {
      type: String,
      default: ''
    },
    processId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      codeList: [], // 处理结果配置
      taskList: [], // 历史任务记录
      taskNote: '' // 处理意见
    }
  },
  activated() {
    this.$nextTick().then(() => {
      this.taskNote = ''
      this._getTaskList()
    })
  },
  methods: {
    closeClick() {
      let view = {name: this.$route.name, path: this.$route.path}
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name
    },
    handelResolve({taskCode, taskName, message}) {
      if (taskCode === -1 && !this.taskNote) {
        this.$message.error('请输入处理意见')
        return
      }
      this.$emit('handel', {taskCode, taskName, message, taskNote: this.taskNote})
    },
    mateTaskCode(code) {
      return this.codeList.filter(item => {
        return item.value === code
      })[0].name
    },
    _getTaskList() {
      getTaskList(this.processId).then(res => {
        this.taskList = res.data
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.approve-panel
  margin-bottom 20px
  .history-header
    border-bottom 1px solid white
    .el-col
      padding 15px 0 13px
      text-align center
      color white
      font-size 14px
      font-weight bold
      background #67c23a
      border-right 1px solid white
      &:last-child
        border-right none
  .history-center
    border-bottom 1px solid white
    &:last-child
      border-bottom none
    .el-col
      padding 13px 0 15px
      text-align center
      color #606266
      font-size 14px
      background #d3d4d6
      border-right 1px solid white
      &:last-child
        border-right none
  .handel-center
    border-bottom 1px solid white
    .el-col
      text-align center
      color #606266
      font-size 14px
      background #d3d4d6
      border-right 1px solid white
      &:last-child
        border-right none
  .handel-button
    padding 5px
    background #d3d4d6
    text-align center
</style>
