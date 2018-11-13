<template>
  <div class="app-container none">
    <sticky className="tool-bar info">
      <template>
        <div class="query-wrapper">
          <div class="first"></div>
          <div>
            <el-select v-model="queryModel.category" placeholder="流程分类">
              <el-option
                v-for="category in categoryList"
                :key="category.id"
                :label="category.name"
                :value="category.code">
              </el-option>
            </el-select>
          </div>
          <div><el-input v-model="queryModel.name" placeholder="流程名称"></el-input></div>
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
            <el-select v-model="queryModel.status" placeholder="流程状态">
              <el-option label="审批中" :value="0"></el-option>
              <el-option label="已结束" :value="1"></el-option>
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
      v-if="ready"
      :data="mineList"
      border
      stripe>
      <el-table-column
        align="center"
        label="流程分类">
        <template slot-scope="scope">
          <el-tag>{{mateCategory(scope.row.category)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="流程名称">
        <template slot-scope="scope">
          <el-tag type="success">{{scope.row.procDefName}}</el-tag>
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
        label="申请时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="完成时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="el-icon-time" v-show="scope.row.endTime"></i>
          <span style="margin-left: 10px">{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="imageProcess(scope.row)">流程跟踪</el-button>
          <el-button type="success" size="mini" @click="checkFlow(scope.row)">查看详情</el-button>
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
import { getMinePage } from '@/api/flow'
export default {
  name: 'keep_past',
  data() {
    return {
      baseURL: process.env.BASE_API,
      categoryList: [], // 流程分类数据
      levelList: [], // 流程紧急程度
      mineList: [], // 我发起的流程
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
      if (this.categoryList.length > 0 && this.levelList.length > 0) {
        return true
      }
      return false
    }
  },
  mounted() {
    this._initConfig()
    this._getMineList()
  },
  methods: {
    resetFilter() {
      this.queryModel = {startEnd: []}
      this.currentPage = 1
      this._getMineList()
    },
    selectFilter() {
      this.currentPage = 1
      this._getMineList()
    },
    imageProcess(task) {
      this.imageUrl = `${this.baseURL}/process/follow?processId=${task.procInstId}&time=${new Date().getTime()}`
      this.imageVisible = true
    },
    checkFlow(mine) {
      this.$router.push({
        name: `keep_${mine.procDefKey}`,
        params: {
          task: mine,
          formKey: '-'
        }
      })
    },
    mateCategory(category) {
      return this.categoryList.filter(item => {
        return item.code === category
      })[0].name
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
      this._getMineList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this._getMineList()
    },
    _initConfig() {
      getConfDataTree('ProcessType').then(res => {
        this.categoryList = res.data
      })
      getConfDataTree('UrgentLevel').then(res => {
        this.levelList = res.data
      })
    },
    _getMineList() {
      getMinePage(this.queryModel, this.currentPage, this.pageSize).then(res => {
        this.totalRecode = res.data.total
        this.mineList = res.data.data
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
