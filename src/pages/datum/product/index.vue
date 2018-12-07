<template>
  <div class="app-container fixed-none">
    <el-scrollbar class="group" wrap-class="scrollbar-wrapper">
      <div class="header">
        <div class="title">产品分类</div>
        <el-button type="success" size="mini" icon="el-icon-plus" @click="insertGroup()">新增分类</el-button>
      </div>
      <div class="six-tree-wrapper">
        <el-tree
          node-key="id"
          default-expand-all
          :data="groupTree"
          highlight-current
          :expand-on-click-node=false
          @node-click="groupClick"
          ref="groupTree">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <div>{{data.name}}</div>
            <div class="operate">
              <i class="el-icon-upload2" @click.stop="upGroup(data)"></i>
              <i class="el-icon-download" @click.stop="downGroup(data)"></i>
              <i class="el-icon-circle-plus-outline" @click.stop="insertGroup(data)"></i>
              <i class="el-icon-edit" @click.stop="updateGroup(data, node)"></i>
              <i class="el-icon-delete" @click.stop="deleteGroup(data)"></i>
            </div>
          </div>
        </el-tree>
      </div>
    </el-scrollbar>
    <div class="product">
      <div class="header">
        <div class="title">产品列表{{group.id ? ` __ ${group.name}` : ''}}</div>
      </div>
    </div>
    <el-dialog
      top="0"
      width="400px"
      :title="groupTitle"
      :visible.sync="groupVisible"
      @close="closeGroupForm">
      <el-form :model="groupModel" :rules="groupRules" label-position="left" label-width="80px" ref="groupForm" style="margin: 0 20px">
        <el-form-item label="上级分类">
          <el-input :value="groupModel.parent.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="groupModel.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitGroupModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="400px"
      title="操作提示"
      :visible.sync="deleteGroupVisible">
      <div>确定要删除 <span class="strong-font danger">{{groupModel.name}}</span> 这个产品分类吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteGroupVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteGroupModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getProductGroupTree, insertProductGroup, updateProductGroup, deleteProductGroup, upProductGroup, downProductGroup } from '@/api/datum'

export default {
  data() {
    return {
      groupTree: [],
      group: {},
      groupModel: { parent: {id: 0, name: '顶级分类'} },
      groupRules: {
        name: [{required: true, message: '分类名称不能为空', trigger: 'blur'}]
      },
      groupTitle: '',
      groupVisible: false,
      deleteGroupVisible: false
    }
  },
  mounted() {
    this._initData()
  },
  methods: {
    groupClick(group) {
      this.group = group
    },
    insertGroup(group) {
      this.groupModel = { parent: {id: 0, name: '顶级分类'} }
      if (group) {
        this.groupModel = { parent: {id: group.id, name: group.name} }
      }
      this.groupTitle = '新增产品分类'
      this.groupVisible = true
    },
    updateGroup(group, node) {
      this.groupModel = { parent: {id: 0, name: '顶级分类'} }
      if (node.parent.parent) {
        this.groupModel.parent = {id: node.parent.data.id, name: node.parent.data.name}
      }
      Object.assign(this.groupModel, group)
      this.groupTitle = '编辑产品分类'
      this.groupVisible = true
    },
    deleteGroup(group) {
      Object.assign(this.groupModel, group)
      this.deleteGroupVisible = true
    },
    upGroup(group) {
      upProductGroup(group.id).then(() => {
        this._initData()
      })
    },
    downGroup(group) {
      downProductGroup(group.id).then(() => {
        this._initData()
      })
    },
    submitGroupModel() {
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          this.groupModel.parentId = this.groupModel.parent.id
          if (!this.groupModel.id) {
            insertProductGroup(this.groupModel).then(() => {
              this._initData()
              this.groupVisible = false
            })
          } else {
            updateProductGroup(this.groupModel).then(() => {
              this._initData()
              this.groupVisible = false
            })
          }
        }
      })
    },
    deleteGroupModel() {
      deleteProductGroup(this.groupModel.id).then(() => {
        this._initData()
        this.deleteGroupVisible = false
      })
    },
    closeGroupForm() {
      this.$refs.groupForm.clearValidate()
    },
    _initData() {
      getProductGroupTree().then(res => {
        this.groupTree = res.data
        setTimeout(() => {
          this.$refs.groupTree.setCurrentNode(this.group)
        }, 10)
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.app-container
  display flex
  .header
    position relative
    padding 0 10px
    height 50px
    background #909399
    .title
      font-weight bold
      line-height 50px
      color white
    .el-button
      position absolute
      top 11px
      right 11px
  .group
    position relative
    min-width 240px
    height 100%
    border-right 1px solid #ccc
    .custom-tree-node
      display flex
      width 100%
      line-height 40px
      &:hover
        .operate
          display block
      .operate
        flex-grow 1
        padding 0 11px
        font-size 16px
        text-align right
        display none
        i:hover
          color #409eff
          background white
  .product
    flex-grow 1
    min-width 400px
    height 100%
</style>
