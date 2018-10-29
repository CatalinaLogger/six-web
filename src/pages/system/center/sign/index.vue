<template>
  <div class="main-sign">
    <el-table
      :data="signList"
      border
      stripe>
      <el-table-column
        align="center"
        label="登录地址">
        <template slot-scope="scope">
          <el-tag type="success">{{scope.row.loginIp}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="loginTime"
        label="登录时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="登录操作系统"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.loginSystem }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="登录应用">
        <template slot-scope="scope">
          <div :class="'level-'+scope.row.level">{{scope.row.loginBrowser}}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="totalRecode > 10"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="totalRecode">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSignPage } from '@/api/system'

export default {
  data() {
    return {
      signList: [],
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      totalRecode: 0
    }
  },
  mounted() {
    this._getSignList()
  },
  methods: {
    handleSizeChange(val) {
      if (val > this.pageSize) {
        this.currentPage = Math.ceil(this.totalRecode / val)
      }
      this.pageSize = val
      this._getSignList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this._getSignList()
    },
    _getSignList() {
      getSignPage(this.currentPage, this.pageSize).then(res => {
        this.totalRecode = res.data.total
        this.signList = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
