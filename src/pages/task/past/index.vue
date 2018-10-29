<template>
  <div class="app-container none">
    <sticky className="tool-bar info">
      <template>
        <div class="query-wrapper">
          <div class="first"></div>
          <div><el-input v-model="queryModel.name" placeholder="流程名称"></el-input></div>
          <div><el-input v-model="queryModel.task" placeholder="任务名称"></el-input></div>
          <div><el-input v-model="queryModel.user" placeholder="发起人"></el-input></div>
          <div>
            <el-select v-model="queryModel.level" placeholder="紧急程度">
              <el-option
                v-for="level in levelList"
                :key="level.value"
                :label="level.name"
                :value="level.value">
              </el-option>
            </el-select>
          </div>
          <div>
            <el-date-picker
              v-model="queryModel.startEnd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="button">
            <el-button-group>
              <el-button type="danger" @click="resetFilter">重置</el-button>
              <el-button type="primary" @click="selectFilter">查询</el-button>
            </el-button-group>
          </div>
        </div>
      </template>
    </sticky>
    <el-table
      :data="pastList"
      v-if="ready"
      border
      stripe>
      <el-table-column
        align="center"
        label="流程名称">
        <template slot-scope="scope">
          <el-tag type="success">{{scope.row.procDefName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="任务名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="接收时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.startTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="处理时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="紧急程度">
        <template slot-scope="scope">
          <div :class="'level-'+scope.row.level">{{mateLevel(scope.row.level)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createUser"
        label="发起人">
      </el-table-column>
      <el-table-column
        align="center"
        prop="createDept"
        label="所属部门">
      </el-table-column>
      <el-table-column
        align="center"
        label="发起时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="imageProcess(scope.row)">流程跟踪</el-button>
          <el-button type="success" size="mini" @click="checkTask(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="totalRecode > 20"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="totalRecode">
    </el-pagination>
    <el-dialog
      fullscreen
      :visible.sync="imageVisible">
      <div>
        <img :src="imageUrl" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Sticky from '@/components/sticky'
import { getConfDataTree } from '@/api/global'
import { getPastPage } from '@/api/flow'
export default {
  name: 'keep_past',
  data() {
    return {
      baseURL: process.env.BASE_API,
      levelList: [],
      pastList: [],
      imageVisible: false,
      imageUrl: '',
      queryModel: {
        startEnd: []
      },
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      pageSize: 20,
      totalRecode: 0
    }
  },
  computed: {
    ready() {
      if (this.levelList.length > 0) {
        return true
      }
      return false
    }
  },
  mounted() {
    this._initConfig()
    this._getPastList()
  },
  methods: {
    resetFilter() {
      this.queryModel = {startEnd: []}
      this.currentPage = 1
      this._getPastList()
    },
    selectFilter() {
      this.currentPage = 1
      this._getPastList()
    },
    imageProcess(task) {
      this.imageUrl = `${this.baseURL}/process/follow?processId=${task.procInstId}&time=${new Date().getTime()}`
      this.imageVisible = true
    },
    checkTask(task) {
      this.$router.push({
        name: `keep_${task.procDefKey}`,
        params: {
          task: task,
          formKey: '-'
        }
      })
    },
    mateLevel(level) {
      return this.levelList.filter(item => {
        return item.value === level
      })[0].name
    },
    handleSizeChange(val) {
      if (val > this.pageSize) {
        this.currentPage = Math.ceil(this.totalRecode / val)
      }
      this.pageSize = val
      this._getPastList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this._getPastList()
    },
    _initConfig() {
      getConfDataTree('UrgentLevel').then(res => {
        this.levelList = res.data
      })
    },
    _getPastList() {
      getPastPage(this.queryModel, this.currentPage, this.pageSize).then(res => {
        this.totalRecode = res.data.total
        this.pastList = res.data.data
      })
    }
  },
  components: {
    Sticky
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
