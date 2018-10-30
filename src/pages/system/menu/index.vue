<template>
  <div class="app-container back">
    <div class="operate-wrapper">
      <el-button type="success" size="mini" @click="addMenu()">添加</el-button>
    </div>
    <tree-table :data="menuTree" :columns="columns" expandAll border stripe>
      <el-table-column align="center" label="图标">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜单类型">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.type === 0">目录</el-tag>
          <el-tag type="success" v-if="scope.row.type === 1">菜单</el-tag>
          <el-tag v-if="scope.row.type === 2">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="seq" label="排序号"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        show-overflow-tooltip>
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
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editMenu(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" :disabled="scope.row.type === 2" @click="addMenu(scope.row)">添加</el-button>
          <el-button type="danger" size="mini" @click="deleteMenu(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog
      v-el-drag-dialog
      top="0"
      width="600px"
      :title="menuFormTitle"
      :visible.sync="menuVisible"
      @close="closeMenuForm">
      <el-form :model="menuModel" :rules="menuRules" label-width="80px" ref="menuForm" style="margin: 0 60px">
        <el-form-item label="上级菜单">
          <el-input :value="menuModel.parent.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="menuModel.type">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuModel.name"></el-input>
        </el-form-item>
        <el-form-item label="路由编码" prop="path">
          <el-input v-model="menuModel.path"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-row>
            <el-col :span="4">
              <el-switch
                v-model="menuModel.hidden"
                :active-value="1"
                :inactive-value="0"
                active-color="#409eff"
                inactive-color="#d9dce2">
              </el-switch>
            </el-col>
            <el-col :span="4">
              是否缓存
            </el-col>
            <el-col :span="4">
              <el-switch
                v-model="menuModel.cache"
                :active-value="1"
                :inactive-value="0"
                active-color="#409eff"
                inactive-color="#d9dce2">
              </el-switch>
            </el-col>
            <el-col :span="4">
              图标
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="mini" style="width: 100%" @click="showIconOption">
                <svg-icon v-if="menuModel.icon" className="icon-current" :icon-class="menuModel.icon"></svg-icon>
                <span class="icon-current" v-else>选择图标</span>
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="重定向">
          <el-input v-model="menuModel.redirect"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="seq">
          <el-input v-model="menuModel.seq"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input maxlength="150" v-model="menuModel.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-dialog
        v-el-drag-dialog
        title="图标列表"
        top="0"
        width="400px"
        :visible.sync="iconVisible"
        append-to-body>
        <div class="icons-wrapper">
          <div class="icon-box" :class="{select:menuModel.icon === item}" v-for="item of iconList" :key="item" @click="selectIcon(item)">
            <svg-icon className="icon-option" :icon-class="item"></svg-icon>
          </div>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMenuModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="deleteVisible">
      <div>确定要删除 <span class="strong-font danger">{{menuModel.name}}</span> 及其子菜单吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteMenuModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import icons from './icons'
import treeTable from '@/components/tree-table'
import ElDragDialog from '@/components/drag-dialog' // base on element-ui
import { getMenuTree, insertMenu, updateMenu, deleteMenu } from '@/api/system'
export default {
  name: 'keep_menu',
  directives: { ElDragDialog },
  data() {
    const validateName = (rule, value, callback) => {
      if (!value || value.length < 1 || value.length > 10) {
        callback(new Error('菜单名称长度在1~10位之间'))
      } else {
        callback()
      }
    }
    const validatePath = (rule, value, callback) => {
      if (!value || value.length < 1 || value.length > 50) {
        callback(new Error('路由编码长度在1~50位之间'))
      } else {
        callback()
      }
    }
    return {
      columns: [
        {
          text: '菜单名称',
          value: 'name',
          width: 200
        },
        {
          text: '路由编码',
          value: 'path',
          width: 120
        }
      ],
      menuTree: [],
      menuFormTitle: '',
      menuVisible: false,
      menuModel: {
        parent: {
          id: 0,
          name: '顶级菜单'
        },
        hidden: 0,
        cache: 0
      },
      menuRules: {
        name: [{required: true, trigger: 'blur', validator: validateName}],
        path: [{required: true, trigger: 'blur', validator: validatePath}],
        seq: [{required: true, message: '排序号为必填项', trigger: 'blur'}]
      },
      iconVisible: false,
      iconList: [''],
      deleteVisible: false
    }
  },
  mounted() {
    this._getMenuTree()
    const iconList = icons.state.iconsMap.map((i) => {
      return i.default.id.substring(5)
    }).filter((i) => {
      return i.indexOf('menu-') > -1
    })
    this.iconList = this.iconList.concat(iconList)
  },
  methods: {
    editMenu(menu) {
      this.menuModel = {
        parent: {
          id: 0,
          name: '顶级菜单'
        },
        type: 0,
        hidden: 0,
        cache: 0
      }
      Object.assign(this.menuModel, menu)
      this.menuFormTitle = '编辑菜单信息'
      this.menuVisible = true
    },
    addMenu(menu) {
      this.menuModel = {
        parent: {
          id: 0,
          name: '顶级菜单'
        },
        type: 0,
        hidden: 0,
        cache: 0
      }
      if (menu) {
        Object.assign(this.menuModel.parent, menu)
      }
      this.menuModel.seq = 1
      this.menuFormTitle = '添加菜单信息'
      this.menuVisible = true
    },
    deleteMenu(menu) {
      Object.assign(this.menuModel, menu)
      this.deleteVisible = true
    },
    saveMenuModel() {
      if (this.menuModel.id) {
        updateMenu(this.menuModel).then(() => {
          this.menuVisible = false
          this._getMenuTree()
        })
      } else {
        insertMenu(this.menuModel).then(() => {
          this.menuVisible = false
          this._getMenuTree()
        })
      }
    },
    deleteMenuModel() {
      deleteMenu(this.menuModel.id).then(() => {
        this.deleteVisible = false
        this._getMenuTree()
      })
    },
    closeMenuForm() {
      this.$refs.menuForm.clearValidate()
    },
    showIconOption() {
      this.iconVisible = true
    },
    selectIcon(icon) {
      this.menuModel.icon = icon
      this.iconVisible = false
    },
    _getMenuTree() {
      getMenuTree().then(res => {
        this.menuTree = res.data
      })
    }
  },
  components: {
    treeTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.icon-current
  font-size 20px
  color white
.icon-option
  font-size 30px
.blank-box
  display inline-block
  width 50px
  height 52px
  background #d9dce2
.icons-wrapper
  padding-bottom 20px
  .icon-box
    display inline-block
    padding-top 10px
    width 50px
    height 50px
    text-align center
    cursor pointer
    &:hover
      background #ccc
    &.select
      color white
      background #409eff
</style>
