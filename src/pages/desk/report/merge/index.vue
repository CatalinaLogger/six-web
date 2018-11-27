<template>
  <div class="app-container none">
    <sticky className="tool-bar info">
      <template>
        <div class="query-wrapper">
          <div class="first">
            <el-radio-group v-model="report">
              <el-radio-button label="weekly">周报</el-radio-button>
              <el-radio-button label="monthly">月报</el-radio-button>
            </el-radio-group>
          </div>
          <div class="button">
            <el-date-picker
              v-if="report === 'weekly'"
              v-model="week"
              type="week"
              format="yyyy 第 WW 周"
              placeholder="选择周"
              @change="changeWeek">
            </el-date-picker>
          </div>
        </div>
      </template>
    </sticky>
    <tree-table :data="weeklyTree" :columns="weeklyCol" border stripe v-if="report === 'weekly'">
      <el-table-column align="center" label="本周完成工作">
        <template slot-scope="scope"><div class="text">{{scope.row.done}}</div></template>
      </el-table-column>
      <el-table-column align="center" label="本周工作总结">
        <template slot-scope="scope"><div class="text">{{scope.row.sum}}</div></template>
      </el-table-column>
      <el-table-column align="center" label="下周工作计划">
        <template slot-scope="scope"><div class="text">{{scope.row.plan}}</div></template>
      </el-table-column>
      <el-table-column align="center" label="需要协调与帮助">
        <template slot-scope="scope"><div class="text">{{scope.row.help}}</div></template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope"><div class="text">{{scope.row.remark}}</div></template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script type="text/ecmascript-6">
import Sticky from '@/components/sticky'
import treeTable from '@/components/tree-table'
import { mergeWeekly } from '@/api/desk'
let moment = require('moment')

export default {
  name: 'keep_merge',
  data() {
    return {
      report: 'weekly',
      week: '',
      weeklyTree: [],
      weeklyCol: [
        {
          text: '姓名',
          value: 'operateName'
        }
      ]
    }
  },
  mounted() {
    this._initData()
  },
  methods: {
    changeWeek(date) {
      mergeWeekly(moment(date).format('YYYY-MM-DD')).then(res => {
        this.weeklyTree = res.data
      })
    },
    _initData() {
      mergeWeekly().then(res => {
        this.weeklyTree = res.data
      })
    }
  },
  components: {
    Sticky,
    treeTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.first
  text-align left
.text
  text-align left
  white-space pre
  white-space pre-line
  word-wrap break-word
</style>
