<template>
  <div class="app-container back">
    <div class="operate-wrapper">
      <div class="left">
        <el-button-group>
          <el-button size="mini" type="primary" v-for="(item, index) in userList" :key="item.id" @click="callbackOthers(item)">
            {{item.name}}<i class="icon-right el-icon-arrow-right" v-if="!(userList.length - 1 === index)"></i>
          </el-button>
        </el-button-group>
      </div>
      <div>
        <el-button type="success" size="mini" :disabled="!mineInfo.level" @click="showPushDialog">添加下属</el-button>
        <el-button type="danger" size="mini" :disabled="!pullKeys.length > 0" @click="showPullDialog">解除下属</el-button>
      </div>
    </div>
    <el-table
      :data="withList"
      border
      stripe
      @selection-change="pullSelection">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="mail"
        label="邮箱"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="部门"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="primary">{{scope.row.deptName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status === 0">未激活</el-tag>
          <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 2">冻结</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="170">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="entryOthers(scope.row)" :disabled="entryDisabled">TA的下属</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      top="0"
      width="800px"
      :visible.sync="pushVisible">
      <div class="unbound-head-wrapper">
        <el-tag>用户列表</el-tag>
        <el-input class="input-query" size="mini" v-model="query" placeholder="姓名/手机/邮箱" clearable>
          <el-button slot="append" @click="handleQuery">查询</el-button>
        </el-input>
      </div>
      <scroll-bar class="unbound-list-wrapper" :list="noneList">
        <el-table
          v-if="pushVisible"
          :data="noneList"
          size="mini"
          border
          stripe
          @selection-change="pushSelection">
          <el-table-column
            align="center"
            type="selection">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机">
          </el-table-column>
          <el-table-column
            prop="mail"
            label="邮箱"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            label="部门"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="primary">{{scope.row.deptName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status === 0">未激活</el-tag>
              <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 2">冻结</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </scroll-bar>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="totalRecode">
      </el-pagination>
      <div slot="footer">
        <el-button @click="pushVisible = false">取 消</el-button>
        <el-button type="primary" @click="pushUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="pullVisible">
      <div>确定要解除选中的 <span class="strong-font danger">{{userInfo.name}}</span> 的下属吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pullVisible = false">取 消</el-button>
        <el-button type="primary" @click="pullUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import ScrollBar from '@/components/scroll-bar'
import { getMineInfo, getWithList, getNonePage, underPush, underPull } from '@/api/system'

export default {
  name: 'keep_under',
  data() {
    return {
      mineInfo: {}, /** 我的信息 */
      userInfo: {}, /** 当前层级领导 */
      userList: [],
      withList: [], /** 我领导的人员 */
      noneList: [], /** 没有领导的人员 */
      pushVisible: false,
      pullVisible: false,
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      pageSize: 20,
      totalRecode: 0,
      query: '',
      pushKeys: [],
      pullKeys: [],
      entryDisabled: false
    }
  },
  mounted() {
    this._initData()
  },
  methods: {
    entryOthers(userInfo) {
      this.entryDisabled = true
      this.userInfo = userInfo
      this.userList.push(userInfo)
      this._getUserList()
    },
    callbackOthers(userInfo) {
      this.userInfo = userInfo
      this.userList = this.userList.slice(0, this.userList.indexOf(userInfo) + 1)
      this._getUserList()
    },
    showPushDialog() {
      this.pushVisible = true
    },
    showPullDialog() {
      this.pullVisible = true
    },
    pushSelection(selection) {
      this.pushKeys = selection.map(item => {
        return item.id
      })
    },
    pushUser() {
      let userId = this.mineInfo.id === this.userInfo.id ? null : this.userInfo.id
      underPush(userId, this.pushKeys).then(() => {
        this.pushVisible = false
        this._getUserList()
      })
    },
    pullSelection(selection) {
      this.pullKeys = selection.map(item => {
        return item.id
      })
    },
    pullUser() {
      let userId = this.mineInfo.id === this.userInfo.id ? null : this.userInfo.id
      underPull(userId, this.pullKeys).then(() => {
        this.pullVisible = false
        this._getUserList()
      })
    },
    handleQuery() {
      this._getNonePage()
    },
    handleSizeChange(val) {
      if (val > this.pageSize) {
        this.currentPage = Math.ceil(this.totalRecode / val)
      }
      this.pageSize = val
      this._getNonePage()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this._getNonePage()
    },
    _getUserList() {
      getWithList(this.userInfo.id).then(res => {
        this.withList = res.data
        this.entryDisabled = false
      })
      this._getNonePage()
    },
    _getNonePage() {
      getNonePage(this.query, this.currentPage, this.pageSize).then(res => {
        this.totalRecode = res.data.total
        this.noneList = res.data.data
      })
    },
    _initData() {
      getMineInfo().then(res => {
        this.mineInfo = res.data
        this.userInfo = res.data
        this.userList.push(res.data)
        this._getUserList()
      })
    }
  },
  components: {
    ScrollBar
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.el-button-group
  .el-button
    padding 7px 5px
    border-left 0px
    border-right 0px
    &:first-child
      padding-left 15px
    &:last-child
      padding-right 15px
    .icon-right
      margin-left 10px
.unbound-head-wrapper
  display block
  width 100%
  height 33px
  .input-query
    width 300px
    float right
    margin-bottom 5px
.unbound-list-wrapper
  position relative
  width 100%
  height 400px
  background white
  overflow hidden
</style>
