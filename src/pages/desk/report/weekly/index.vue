<template>
  <div class="app-container back form-wrapper">
    <el-form :model="weeklyModel" :rules="weeklyRules" ref="weeklyForm">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="本周工作计划">
            <el-input type="textarea" :autosize="autoSize" v-model="plan" placeholder="此处不用填写"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="本周完成工作" prop="done">
            <el-input type="textarea" :autosize="autoSize" v-model="weeklyModel.done"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="本周工作总结">
            <el-input type="textarea" :autosize="autoSize" v-model="weeklyModel.sum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="下周工作计划" prop="plan">
            <el-input type="textarea" :autosize="autoSize" v-model="weeklyModel.plan"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="需要协调与帮助">
            <el-input type="textarea" :autosize="autoSize" v-model="weeklyModel.help"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注">
            <el-input type="textarea" :autosize="autoSize" v-model="weeklyModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item align="center">
        <el-button type="primary" @click="saveForm" :loading="loading">提交周报</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { selectWeeklyBefore, selectWeekly, insertWeekly } from '@/api/desk'

export default {
  name: 'keep_weekly',
  data() {
    return {
      weeklyModel: {},
      weeklyRules: {
        done: [{required: true, trigger: 'blur', message: '本周完成工作不能为空'}],
        plan: [{required: true, trigger: 'blur', message: '下周工作计划不能为空'}]
      },
      autoSize: { minRows: 14 },
      plan: '',
      loading: false
    }
  },
  mounted() {
    this._initData()
  },
  methods: {
    saveForm() {
      this.loading = true
      insertWeekly(this.weeklyModel).then(() => {
        this.loading = false
      })
    },
    _initData() {
      selectWeekly().then(res => {
        if (res.data) {
          this.weeklyModel = res.data
        }
      })
      selectWeeklyBefore().then(res => {
        if (res.data) {
          this.plan = res.data.plan
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
