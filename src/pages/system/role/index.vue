<template>
  <div class="app-container fixed back">
    <div class="card-item guide app-box">
      <div class="card-title">
        <span class="title-text">角色列表</span>
        <el-button class="add-button" type="success" size="mini" @click="addGroup()">新增角色组</el-button>
      </div>
      <scroll-bar class="role-option-wrapper" :delta="15">
        <div class="six-tree-wrapper">
          <el-tree
            highlight-current
            default-expand-all
            node-key="id"
            :data="roleTree"
            :props="roleProps"
            :expand-on-click-node=false
            @node-click="nodeClick"
            ref="roleTree">
          </el-tree>
        </div>
      </scroll-bar>
    </div>
    <div class="card-item center app-box">
      <div class="group" v-if="currentRole.parentId === 0">
        <div class="card-title">
          <el-button type="primary" size="mini" @click="editGroup()" :disabled="!currentRole.edit">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteGroup()" :disabled="!currentRole.edit">删除</el-button>
          <el-button class="add-button" type="success" size="mini" @click="addRole()" :disabled="!currentRole.edit">新增角色</el-button>
        </div>
        <scroll-bar class="inside-table-wrapper" :list="currentRole.children">
          <el-table
            stripe
            :key="1"
            :data="currentRole.children">
            <el-table-column align="center" prop="code" label="角色编码"></el-table-column>
            <el-table-column align="center" prop="name" label="角色名称"></el-table-column>
            <el-table-column align="center" label="更新时间" show-overflow-tooltip>
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.operateTime }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="更新人员" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag type="warning">{{scope.row.operateName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editRole(scope.row)" :disabled="!currentRole.edit">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteRole(scope.row)" :disabled="!currentRole.edit">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </scroll-bar>
      </div>
      <div class="role" v-else>
        <div class="card-title">
          <el-button type="success" size="mini" @click="pushUser()" :disabled="!currentRole.edit">添加成员</el-button>
          <el-button type="warning" size="mini" @click="pullUser()" :disabled="!currentRole.edit">批量移除</el-button>
          <el-input class="input-query" size="mini" v-model="query" placeholder="姓名/手机/邮箱" clearable>
            <el-button slot="append" @click="handleQuery">查询</el-button>
          </el-input>
        </div>
        <scroll-bar class="inside-table-wrapper pagination" :list="userData">
          <el-table
            stripe
            :key="2"
            :data="userData"
            @selection-change="untyingUser">
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="手机" show-overflow-tooltip></el-table-column>
            <el-table-column prop="mail" label="邮箱" show-overflow-tooltip></el-table-column>
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
    </div>
    <el-dialog
      top="0"
      width="500px"
      :title="groupFormTitle"
      :visible.sync="groupVisible"
      @close="closeGroupForm"
      append-to-body>
      <el-form :model="groupModel" :rules="groupRules" ref="groupForm" style="margin: 0 60px">
        <el-form-item label="角色组名称" prop="name">
          <el-input v-model="groupModel.name" max="20"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="groupVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGroupModel">确 定</el-button>
      </div>
    </el-dialog>
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
              node-key="id"
              show-checkbox
              default-expand-all
              :expand-on-click-node=false
              :data="menuTree"
              :props="menuProps"
              :default-checked-keys="roleModel.menuKeys"
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
      :visible.sync="deleteRoleVisible">
      <div>
        <p class="strong-font danger">删除后将无法恢复</p> 确定要删除
        <span class="strong-font danger">{{roleModel.name}}</span>
        <span v-if="roleModel.parentId === 0"> 这个角色组</span>
        <span v-else> 这个角色</span>吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRoleModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import ScrollBar from '@/components/scroll-bar'
import { getGroupList, getRoleList, getRoleMenuKeys, insertGroup, updateGroup, insertRole, updateRole, deleteRole, getMenuTree, getBoundUserPage, getUnboundUserPage, binding, untying } from '@/api/system'

export default {
  name: 'keep_role',
  data() {
    return {
      menuTree: [],
      menuProps: {
        children: 'children',
        label: 'name'
      },
      roleTree: [],
      roleProps: {
        children: 'children',
        label: 'name'
      },
      groupList: [],
      roleList: [],
      groupVisible: false,
      groupFormTitle: '',
      groupModel: {},
      groupRules: {
        name: [{required: true, trigger: 'blur', message: '角色组名称为必填项'}]
      },
      currentRole: {}, /** 当前选定角色 */
      roleModel: {menuKeys: []},
      roleRules: {
        code: [{required: true, trigger: 'blur', message: '角色编码为必填项'}],
        name: [{required: true, trigger: 'blur', message: '角色名称为必填项'}]
      },
      deleteRoleVisible: false,
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
    this._getRoleData()
    this._getMenuTree()
  },
  methods: {
    nodeClick(role) {
      this.currentRole = role
      this._getBoundUserPage(this.currentRole.id, this.query, this.currentPage, this.pageSize)
      this._getUnboundUserPage(this.currentRole.id, this.queryUn, this.currentUnPage, this.pageUnSize)
    },
    addGroup() {
      this.groupFormTitle = '新增角色组'
      this.groupVisible = true
    },
    editGroup() {
      this.groupModel = {id: this.currentRole.id, name: this.currentRole.name}
      this.groupFormTitle = '编辑角色组'
      this.groupVisible = true
    },
    deleteGroup() {
      Object.assign(this.roleModel, this.currentRole)
      this.deleteRoleVisible = true
    },
    saveGroupModel() {
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          if (this.groupModel.id) {
            updateGroup(this.groupModel).then(() => {
              this.groupVisible = false
              this._getRoleData()
            })
          } else {
            insertGroup(this.groupModel).then(() => {
              this.groupVisible = false
              this._getRoleData()
            })
          }
        }
      })
    },
    closeGroupForm() {
      this.groupModel = {}
      this.$refs.groupForm.clearValidate()
    },
    addRole() {
      this.roleVisible = true
    },
    editRole(role) {
      Object.assign(this.roleModel, role)
      getRoleMenuKeys(role.id).then(res => {
        res.data.forEach(key => {
          this.$refs.menuTree.setChecked(key, true)
        })
      })
      this.roleVisible = true
    },
    deleteRole(role) {
      Object.assign(this.roleModel, role)
      this.deleteRoleVisible = true
    },
    saveRoleModel() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.roleModel.groupId = this.currentRole.id
          this.roleModel.menuKeys = this.$refs.menuTree.getCheckedKeys().concat(this.$refs.menuTree.getHalfCheckedKeys())
          if (this.roleModel.id) {
            updateRole(this.roleModel).then(() => {
              this.roleVisible = false
              this._getRoleData()
            })
          } else {
            insertRole(this.roleModel).then(() => {
              this.roleVisible = false
              this._getRoleData()
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
        this.deleteRoleVisible = false
        this._getRoleData()
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
    _getRoleData() {
      getGroupList().then(res => {
        this.groupList = res.data
        this._genRoleTree()
      })
      getRoleList().then(res => {
        this.roleList = res.data
        this._genRoleTree()
      })
    },
    _genRoleTree() {
      this.roleTree = []
      this.groupList.forEach(group => {
        group.children = []
        this.roleList.forEach(role => {
          if (group.id === role.parentId) {
            group.children.push(role)
          }
        })
        this.roleTree.push(group)
      })
      setTimeout(() => {
        this.$refs.roleTree.setCurrentNode(this.currentRole)
      }, 10)
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
      .role-label
        line-height 28px
      .el-button-group
        float right
        .el-button--mini
          padding 7px 13px
    .inside-table-wrapper
      height calc(100vh - 170px)
      background white
      overflow hidden
      &.pagination
        height calc(100vh - 220px)
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
