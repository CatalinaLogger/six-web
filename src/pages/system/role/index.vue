<template>
  <div class="app-container fixed back">
    <div class="card-item guide app-box">
      <div class="card-title">
        <span class="title-text">角色列表</span>
        <el-button class="add-button" type="success" size="mini" @click="addRole()">添加角色</el-button>
      </div>
      <scroll-bar class="role-option-wrapper" :delta="15">
        <div class="role-option" v-for="(item, index) in roleData" :class="highlightRole(item)" :key="index" @click="selectRole(item)">
          <span class="role-name">
            {{item.name}}
            <span class="code">{{item.code}}</span>
          </span>
          <el-button-group>
            <el-button type="warning" icon="el-icon-edit" size="mini" @click.stop="editRole(item)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click.stop="deleteRole(item)"></el-button>
          </el-button-group>
        </div>
      </scroll-bar>
    </div>
    <div class="card-item center app-box">
      <div class="card-title">
        <el-button type="success" size="mini" @click="pushUser()" :disabled="disabledPush">绑定用户</el-button>
        <el-button type="danger" size="mini" @click="pullUser()" :disabled="disabledPull">解绑用户</el-button>
        <el-input class="input-query" size="mini" v-model="query" placeholder="姓名/手机/邮箱" clearable>
          <el-button slot="append" @click="handleQuery">查询</el-button>
        </el-input>
      </div>
      <scroll-bar class="inside-table-wrapper" :list="userData">
        <el-table
          stripe
          :data="userData"
          @selection-change="untyingUser">
          <el-table-column
            align="center"
            type="selection">
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
    </div>
    <el-dialog
      top="0"
      width="500px"
      :title="roleFormTitle"
      :visible.sync="roleVisible"
      @close="closeRoleForm"
      append-to-body>
      <el-form :model="roleModel" :rules="roleRules" label-width="80px" ref="roleForm" style="margin: 0 60px">
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="roleModel.code" max="20"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleModel.name" max="20"></el-input>
        </el-form-item>
        <el-form-item label="角色授权">
          <scroll-bar class="menu-option-wrapper">
            <el-tree
              :data="menuTree"
              :props="menuProps"
              node-key="id"
              :default-checked-keys="roleModel.menuKeys"
              show-checkbox
              default-expand-all
              ref="menuTree">
            </el-tree>
          </scroll-bar>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="800px"
      :visible.sync="userVisible">
      <div class="unbound-head-wrapper">
        <el-tag>用户列表</el-tag>
        <el-input class="input-query" size="mini" v-model="queryUn" placeholder="姓名/手机/邮箱" clearable>
          <el-button slot="append" @click="handleUnQuery">查询</el-button>
        </el-input>
      </div>
      <scroll-bar class="unbound-list-wrapper" :list="userUnData">
        <el-table
          v-if="userVisible"
          :data="userUnData"
          size="mini"
          border
          stripe
          @selection-change="bindingUser">
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
        @size-change="handleUnSizeChange"
        @current-change="handleUnCurrentChange"
        :current-page.sync="currentUnPage"
        :page-sizes="pageUnSizes"
        :page-size="pageUnSize"
        layout="total, sizes, prev, pager, next"
        :total="totalUnRecode">
      </el-pagination>
      <div slot="footer">
        <el-button @click="userVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserKeys">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="deleteVisible">
      <div><p class="strong-font danger">删除后将无法恢复</p> 确定要删除 <span class="strong-font danger">{{roleModel.name}}</span> 吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRoleModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import ScrollBar from '@/components/scroll-bar'
import { getRoleList, getRoleMenuKeys, insertRole, updateRole, deleteRole, getMenuTree, getBoundUserPage, getUnboundUserPage, binding, untying } from '@/api/system'

export default {
  name: 'keep_role',
  data() {
    return {
      menuTree: [],
      menuProps: {
        children: 'children',
        label: 'name'
      },
      roleData: [],
      currentRole: {}, /** 当前选定角色 */
      roleModel: {menuKeys: []},
      roleRules: {
        code: [{required: true, trigger: 'blur', message: '角色编码为必填项'}],
        name: [{required: true, trigger: 'blur', message: '角色名称为必填项'}]
      },
      deleteVisible: false,
      roleFormTitle: '',
      roleVisible: false,
      currentPage: 1, /** 已绑定当前角色用户信息 */
      pageSizes: [10, 20, 30, 40],
      pageSize: 20,
      totalRecode: 0,
      query: '',
      userData: [],
      disabledPull: true,
      userVisible: false,
      currentUnPage: 1, /** 未绑定当前角色用户信息 */
      pageUnSizes: [10, 20, 30, 40],
      pageUnSize: 20,
      totalUnRecode: 0,
      queryUn: '',
      userUnData: []
    }
  },
  computed: {
    disabledPush() {
      if (this.userUnData && this.userUnData.length > 0) {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    this._getRoleList()
    this._getMenuTree()
  },
  methods: {
    selectRole(row) {
      this.currentRole = row
      this._getBoundUserPage(this.currentRole.id, this.query, this.currentPage, this.pageSize)
      this._getUnboundUserPage(this.currentRole.id, this.queryUn, this.currentUnPage, this.pageUnSize)
    },
    addRole() {
      this.roleVisible = true
    },
    editRole(role) {
      Object.assign(this.roleModel, role)
      getRoleMenuKeys(role.id).then(res => {
        res.data.forEach(key => {
          this.$refs.menuTree.setChecked(key, true, false)
        })
      })
      this.roleVisible = true
    },
    deleteRole(role) {
      Object.assign(this.roleModel, role)
      this.deleteVisible = true
    },
    saveRoleModel() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.roleModel.menuKeys = this.$refs.menuTree.getCheckedKeys().concat(this.$refs.menuTree.getHalfCheckedKeys())
          if (this.roleModel.id) {
            updateRole(this.roleModel).then(() => {
              this.roleVisible = false
              this._getRoleList()
            })
          } else {
            insertRole(this.roleModel).then(() => {
              this.roleVisible = false
              this._getRoleList()
            })
          }
        }
      })
    },
    deleteRoleModel() {
      deleteRole(this.roleModel.id).then(() => {
        if (this.roleModel.id === this.currentRole.id) {
          this.userData = []
          this.userUnData = []
        }
        this.deleteVisible = false
        this._getRoleList()
      })
    },
    closeRoleForm() {
      this.roleModel = {menuKeys: []}
      this.$refs.menuTree.setCheckedKeys([])
      this.$refs.roleForm.clearValidate()
    },
    pushUser() {
      this.userVisible = true
    },
    pullUser() {
      untying(this.currentRole).then(() => {
        this._getBoundUserPage(this.currentRole.id, this.query, this.currentPage, this.pageSize)
        this._getUnboundUserPage(this.currentRole.id, this.queryUn, this.currentUnPage, this.pageUnSize)
      })
    },
    bindingUser(selection) {
      this.currentRole.bindingKeys = selection.map(item => {
        return item.id
      })
    },
    untyingUser(selection) {
      this.currentRole.untyingKeys = selection.map(item => {
        return item.id
      })
      if (this.currentRole.untyingKeys.length > 0) {
        this.disabledPull = false
      } else {
        this.disabledPull = true
      }
    },
    saveUserKeys() {
      binding(this.currentRole).then(() => {
        this._getBoundUserPage(this.currentRole.id, this.query, this.currentPage, this.pageSize)
        this._getUnboundUserPage(this.currentRole.id, this.queryUn, this.currentUnPage, this.pageUnSize)
        this.userVisible = false
      })
    },
    handleQuery() {
      this._getBoundUserPage(this.currentRole.id, this.query, this.currentPage, this.pageSize)
    },
    handleUnQuery() {
      this._getUnboundUserPage(this.currentRole.id, this.queryUn, this.currentUnPage, this.pageUnSize)
    },
    highlightRole(row) {
      if (this.currentRole.id === row.id) {
        return 'current-row'
      }
      return ''
    },
    handleSizeChange(val) {
      if (val > this.pageSize) {
        this.currentPage = Math.ceil(this.totalRecode / val)
      }
      this.pageSize = val
      if (this.currentRole) {
        this._getBoundUserPage(this.currentRole.id, this.query, this.currentPage, this.pageSize)
      }
    },
    handleCurrentChange(val) {
      if (this.currentRole) {
        this._getBoundUserPage(this.currentRole.id, this.query, val, this.pageSize)
      }
    },
    handleUnSizeChange(val) {
      if (val > this.pageUnSize) {
        this.currentUnPage = Math.ceil(this.totalUnRecode / val)
      }
      this.pageUnSize = val
      if (this.currentRole) {
        this._getUnboundUserPage(this.currentRole.id, this.queryUn, this.currentUnPage, this.pageUnSize)
      }
    },
    handleUnCurrentChange(val) {
      if (this.currentRole) {
        this._getUnboundUserPage(this.currentRole.id, this.queryUn, val, this.pageUnSize)
      }
    },
    _getRoleList() {
      getRoleList().then(res => {
        this.roleData = res.data
      })
    },
    _getMenuTree() {
      getMenuTree().then(res => {
        this.menuTree = res.data
      })
    },
    _getBoundUserPage(roleId, query, page, size) {
      getBoundUserPage(roleId, query, page, size).then(res => {
        this.totalRecode = res.data.total
        this.userData = res.data.data
      })
    },
    _getUnboundUserPage(roleId, query, page, size) {
      getUnboundUserPage(roleId, query, page, size).then(res => {
        this.totalUnRecode = res.data.total
        this.userUnData = res.data.data
      })
    }
  },
  components: {
    ScrollBar
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.el-table__row.current-row
  background: #409eff
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
      border-bottom 1px solid #ebebeb
      .title-text
        line-height 28px
      .add-button
        float right
      .input-query
        width 300px
        float right
      &.all-role
        background-color: #409eff
        color white
    .role-option-wrapper
      height calc(100vh - 165px)
      background white
      overflow hidden
      .role-option
        padding 8px 11px
        border-bottom 1px solid #ebebeb
        &.current-row
          font-weight bold
          color white
          background #409eff
          .role-name
            .code
              color white
          &:hover
            background #409eff
        &:hover
          background #e2e2e2
        .role-name
          font-size 14px
          line-height 28px
          .code
            color #909399
        .el-button-group
          float right
          .el-button--mini
            padding 7px 13px
    .inside-table-wrapper
      height calc(100vh - 220px)
      background white
      overflow hidden
    .el-pagination
      border-top 1px solid #ebebeb
      padding 8px 0 0 6px
.menu-option-wrapper
  height 260px
  background white
  overflow hidden
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
