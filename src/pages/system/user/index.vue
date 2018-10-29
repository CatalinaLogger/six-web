<template>
  <div class="app-container fixed back">
    <div class="card-item guide app-box">
      <div class="card-title" :class="{'all-dept':allDept}" @click="clickAllDept">
        <span class="title-text">{{deptMine.name}}</span>
      </div>
      <scroll-bar class="dept-option-wrapper">
        <div class="dept-tree-wrapper">
          <el-tree
            default-expand-all
            :data="deptTree"
            :props="deptProps"
            :highlight-current="highlight"
            @node-click="nodeClick"
            ref="tree">
          </el-tree>
        </div>
      </scroll-bar>
    </div>
    <div class="card-item center app-box">
      <div class="card-title">
        <el-button type="success" size="mini" @click="addUser" :disabled="allDept">添加</el-button>
        <el-button type="danger" size="mini" @click="batchDeleteUser" :disabled="disabledUser">删除</el-button>
        <el-input class="input-query" size="mini" v-model="query" placeholder="姓名/手机/邮箱" clearable>
          <el-button slot="append" @click="handleQuery">查询</el-button>
        </el-input>
      </div>
      <scroll-bar class="inside-table-wrapper" :list="userData">
        <el-table
          :data="userData"
          stripe
          @selection-change="selectChange">
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
          <el-table-column align="center" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status === 0">未激活</el-tag>
              <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 2">冻结</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="更新时间"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.operateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="更新人员"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="warning">{{scope.row.operateName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="170">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editUser(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteUser(scope.row)">删除</el-button>
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
    </div>
    <el-dialog
      top="0"
      width="600px"
      :title="userFormTitle"
      :visible.sync="userVisible"
      append-to-body
      @close="closeUserForm">
      <scroll-bar class="user-form-wrapper">
        <el-form :model="userModel" :rules="userRules" label-width="80px" ref="userForm" style="margin: 0 60px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userModel.username" max="20"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userModel.name" max="20"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="userModel.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="userModel.mail" max="40"></el-input>
          </el-form-item>
          <el-form-item label="所属部门">
            <el-button type="primary" plain style="width: 100%" @click="showDeptTree">{{userModel.deptName}}</el-button>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="userModel.remark" max="200"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="userModel.status">
              <el-radio-button label="0" :disabled="disabled0">未激活</el-radio-button>
              <el-radio-button label="1" :disabled="disabled1">正常</el-radio-button>
              <el-radio-button label="2" :disabled="disabled1">冻结</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="角色">
            <el-checkbox-group v-model="userModel.roleKeys">
              <el-checkbox class="role-item" v-for="role in roleList" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </scroll-bar>
      <el-dialog
        title="部门列表"
        top="0"
        width="400px"
        :visible.sync="treeVisible"
        append-to-body>
        <div class="dept-wrapper">
          <el-tree
            class="dept-tree-option"
            accordion
            default-expand-all
            :data="deptTree"
            :props="deptProps"
            @node-click="dialogNodeClick">
          </el-tree>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="deleteVisible">
      <div><p class="strong-font danger">删除后将无法恢复</p> 确定要删除 <span class="strong-font danger">{{userModel.name}}</span> 吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteUserModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="deleteBatchVisible">
      <div><p class="strong-font danger">删除后将无法恢复</p> 确定要删除选中的用户吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteBatchVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteUserKeys">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import ScrollBar from '@/components/scroll-bar'
import treeToArray from '@/components/tree-table/eval'
import { getDeptTree, getDeptMine, getRoleMine, getUserRoleKeys, getUserPage, checkExist, insertUser, updateUser, deleteUser, deleteBatchUser } from '@/api/system'

export default {
  name: 'keep_user',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名为必填项'))
      } else {
        checkExist(this.userModel.id, 'username', value).then(res => {
          if (res.data) {
            callback(new Error('用户名已被占用'))
          } else {
            callback()
          }
        })
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机为必填项'))
      } else if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(value)) {
        callback(new Error('手机格式有误'))
      } else {
        checkExist(this.userModel.id, 'phone', value).then(res => {
          if (res.data) {
            callback(new Error('手机已被占用'))
          } else {
            callback()
          }
        })
      }
    }
    const validateMail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱为必填项'))
      } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback(new Error('邮箱格式有误'))
      } else {
        checkExist(this.userModel.id, 'mail', value).then(res => {
          if (res.data) {
            callback(new Error('邮箱已被占用'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      allDept: true,
      highlight: false,
      deptList: [],
      roleList: [],
      deptTree: [],
      deptMine: {},
      deptProps: {
        children: 'children',
        label: 'name'
      },
      currentDept: {},
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      pageSize: 20,
      totalRecode: 0,
      query: '',
      userData: [],
      userFormTitle: '',
      userVisible: false,
      treeVisible: false,
      userModel: {status: 0, roleKeys: []},
      userRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        name: [{required: true, trigger: 'blur', message: '姓名为必填项'}],
        phone: [{required: true, trigger: 'blur', validator: validatePhone}],
        mail: [{required: true, trigger: 'blur', validator: validateMail}]
      },
      deleteVisible: false,
      userKeys: [],
      disabledUser: true,
      deleteBatchVisible: false
    }
  },
  computed: {
    disabled0() {
      if (this.userModel.id || this.userModel.status) {
        return true
      } else {
        return false
      }
    },
    disabled1() {
      if (this.userModel.id || this.userModel.status) {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    this._getDeptTree()
    this._getDeptMine()
    this._getRoleMine()
    this._getUserPage(null, null, this.currentPage, this.pageSize)
  },
  methods: {
    nodeClick(dept) {
      this.allDept = false
      this.highlight = true
      this.currentDept = dept
      this._getUserPage(this.currentDept.id, this.query, this.currentPage, this.pageSize)
    },
    clickAllDept() {
      this.currentDept = {}
      this._getUserPage(null, this.query, this.currentPage, this.pageSize)
      this.highlight = false
      this.allDept = true
    },
    handleQuery() {
      this._getUserPage(this.currentDept.id, this.query, this.currentPage, this.pageSize)
    },
    addUser() {
      this.userModel = {
        deptId: this.currentDept.id,
        deptName: this.currentDept.name,
        status: 0,
        roleKeys: []
      }
      this.userFormTitle = '添加用户'
      this.userVisible = true
    },
    editUser(user) {
      Object.assign(this.userModel, user)
      let dept = this.deptList.find(item => {
        return item.id === user.deptId
      })
      this.userModel.deptName = dept.name
      this.userModel.roleKeys = []
      getUserRoleKeys(user.id).then(res => {
        this.userModel.roleKeys = res.data
      })
      this.userFormTitle = '编辑用户'
      this.userVisible = true
    },
    deleteUser(user) {
      Object.assign(this.userModel, user)
      this.deleteVisible = true
    },
    deleteUserModel() {
      deleteUser(this.userModel.id).then(() => {
        this.deleteVisible = false
        this._getUserPage(this.currentDept.id, this.query, this.currentPage, this.pageSize)
      })
    },
    selectChange(selection) {
      this.userKeys = selection.map(item => {
        return item.id
      })
      if (this.userKeys.length > 0) {
        this.disabledUser = false
      } else {
        this.disabledUser = true
      }
    },
    batchDeleteUser() {
      this.deleteBatchVisible = true
    },
    deleteUserKeys() {
      deleteBatchUser(this.userKeys).then(() => {
        this.deleteBatchVisible = false
        this._getUserPage(this.currentDept.id, this.query, this.currentPage, this.pageSize)
      })
    },
    closeUserForm() {
      this.$refs.userForm.clearValidate()
    },
    saveUserModel() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.userModel.id) {
            updateUser(this.userModel).then(() => {
              this.userVisible = false
              this._getUserPage(this.currentDept.id, this.query, this.currentPage, this.pageSize)
            })
          } else {
            insertUser(this.userModel).then(() => {
              this.userVisible = false
              this._getUserPage(this.currentDept.id, this.query, this.currentPage, this.pageSize)
            })
          }
        }
      })
    },
    showDeptTree() {
      this.treeVisible = true
    },
    dialogNodeClick(dept) {
      this.userModel.deptId = dept.id
      this.userModel.deptName = dept.name
      this.treeVisible = false
    },
    handleSizeChange(val) {
      if (val > this.pageSize) {
        this.currentPage = Math.ceil(this.totalRecode / val)
      }
      this.pageSize = val
      this._getUserPage(this.currentDept.id, this.query, this.currentPage, this.pageSize)
    },
    handleCurrentChange(val) {
      this._getUserPage(this.currentDept.id, this.query, val, this.pageSize)
    },
    _getDeptTree() {
      getDeptTree().then(res => {
        this.deptTree = res.data
        this.deptList = treeToArray(res.data, false)
      })
    },
    _getDeptMine() {
      getDeptMine().then(res => {
        this.deptMine = res.data
      })
    },
    _getRoleMine() {
      getRoleMine().then(res => {
        this.roleList = res.data
      })
    },
    _getUserPage(deptId, query, page, size) {
      getUserPage(deptId, query, page, size).then(res => {
        this.totalRecode = res.data.total
        this.userData = res.data.data
      })
    }
  },
  components: {
    ScrollBar
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.app-container
  display flex
  .card-item
    background white
    transition .2s
    overflow hidden
    &.guide
      width 280px
    &.center
      flex-grow: 1
      margin-left 20px
    .card-title
      padding 10px
      height 49px
      border-bottom 1px solid #ebebeb
      .title-text
        line-height 28px
      .input-query
        width 300px
        float right
      &.all-dept
        background-color: #409eff
        color white
    .dept-option-wrapper
      height calc(100vh - 165px)
      background white
      overflow hidden
    .inside-table-wrapper
      height calc(100vh - 220px)
      background white
      overflow hidden
    .el-pagination
      border-top 1px solid #ebebeb
      padding 8px 0 0 6px
.user-form-wrapper
  height 470px
  overflow hidden
  background-color white
  .role-item
    margin 0 20px 0 0
.dept-wrapper
  min-height 400px
  .dept-tree-option
    margin 0 30px
</style>
