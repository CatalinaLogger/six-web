<template>
  <div class="app-container fixed-none">
    <el-scrollbar class="group" wrap-class="scrollbar-wrapper">
      <div class="header">
        <div class="title">属性</div>
        <el-button class="button-box" type="success" size="mini" icon="el-icon-plus" @click="insertGroup">新增属性</el-button>
      </div>
      <div class="custom-node" :class="{'active': item.id === group.id}" v-for="item in groupList" :key="item.id" @click="groupClick(item)">
        <div>{{item.name}}</div>
        <div class="operate">
          <i class="el-icon-upload2" @click.stop="upGroup(item)"></i>
          <i class="el-icon-download" @click.stop="downGroup(item)"></i>
          <i class="el-icon-edit" @click.stop="updateGroup(item)"></i>
          <i class="el-icon-delete" @click.stop="deleteGroup(item)"></i>
        </div>
      </div>
    </el-scrollbar>
    <el-scrollbar class="product" wrap-class="scrollbar-wrapper">
      <div class="header">
        <div class="title">属性值列表{{group.id ? ` __ ${group.name}` : ''}}</div>
        <div class="button-box">
          <el-button type="warning" size="mini" icon="el-icon-upload2" @click="upProperty" :disabled="!property.id"></el-button>
          <el-button type="warning" size="mini" icon="el-icon-download" @click="downProperty" :disabled="!property.id"></el-button>
          <el-button type="success" size="mini" icon="el-icon-plus" @click="insertProperty">新增属性值</el-button>
        </div>
      </div>
      <div class="property title"><div>属性值</div><div>更新时间</div><div>更新人员</div><div>操作</div></div>
      <div class="property" :class="{'active': item.id === property.id}" v-for="item in propertyList" :key="item.id" @click="propertyClick(item)">
        <div>{{item.name}}</div>
        <div>{{item.operateTime}}</div>
        <div>{{item.operateName}}</div>
        <div>
          <el-button type="primary" size="mini" @click.stop="updateProperty(item)">编辑</el-button>
          <el-button type="danger" size="mini" @click.stop="deleteProperty(item)">删除</el-button>
        </div>
      </div>
    </el-scrollbar>
    <el-dialog
      top="0"
      width="400px"
      :title="groupTitle"
      :visible.sync="groupVisible"
      @close="closeGroupForm">
      <el-form :model="groupModel" :rules="groupRules" label-position="left" label-width="80px" ref="groupForm" style="margin: 0 20px">
        <el-form-item label="属性" prop="name">
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
      :title="propertyTitle"
      :visible.sync="propertyVisible"
      @close="closePropertyForm">
      <el-form :model="propertyModel" :rules="propertyRules" label-position="left" label-width="80px" ref="propertyForm" style="margin: 0 20px">
        <el-form-item label="属性值" prop="name">
          <el-input v-model="propertyModel.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="propertyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPropertyModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getPropertyGroupList, insertPropertyGroup, updatePropertyGroup, deletePropertyGroup, upPropertyGroup, downPropertyGroup, getPropertyList, insertProperty, updateProperty, deleteProperty, upProperty, downProperty } from '@/api/datum'

export default {
  data() {
    return {
      groupList: [],
      group: {},
      groupModel: {},
      groupRules: {name: [{required: true, message: '属性不能为空', trigger: 'blur'}]},
      groupTitle: '',
      groupVisible: false,
      deleteGroupVisible: false,
      propertyList: [],
      property: {},
      propertyModel: {},
      propertyRules: {name: [{required: true, message: '属性值不能为空', trigger: 'blur'}]},
      propertyTitle: '',
      propertyVisible: false,
      deletePropertyVisible: false
    }
  },
  mounted() {
    this._initData()
  },
  methods: {
    groupClick(group) {
      this.group = group
      this._getPropertyList()
    },
    insertGroup() {
      this.groupModel = {}
      this.groupTitle = '新增属性'
      this.groupVisible = true
    },
    updateGroup(group) {
      Object.assign(this.groupModel, group)
      this.groupTitle = '编辑属性'
      this.groupVisible = true
    },
    deleteGroup(group) {
      Object.assign(this.groupModel, group)
      this.deleteGroupVisible = true
    },
    upGroup(group) {
      upPropertyGroup(group.id).then(() => {
        this._getGroupList()
      })
    },
    downGroup(group) {
      downPropertyGroup(group.id).then(() => {
        this._getGroupList()
      })
    },
    submitGroupModel() {
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          if (!this.groupModel.id) {
            insertPropertyGroup(this.groupModel).then(() => {
              this._getGroupList()
              this.groupVisible = false
            })
          } else {
            updatePropertyGroup(this.groupModel).then(() => {
              this._getGroupList()
              this.groupVisible = false
            })
          }
        }
      })
    },
    deleteGroupModel() {
      deletePropertyGroup(this.groupModel.id).then(() => {
        this._getGroupList()
        this.deleteGroupVisible = false
      })
    },
    closeGroupForm() {
      this.$refs.groupForm.clearValidate()
    },
    insertProperty() {
      this.propertyModel = {}
      this.propertyTitle = '新增属性值'
      this.propertyVisible = true
    },
    propertyClick(property) {
      this.property = property
    },
    updateProperty(property) {
      Object.assign(this.propertyModel, property)
      this.propertyTitle = '编辑属性值'
      this.propertyVisible = true
    },
    deleteProperty(property) {
      Object.assign(this.propertyModel, property)
      this.deletePropertyVisible = true
    },
    upProperty() {
      upProperty(this.property.id).then(() => {
        this._getPropertyList()
      })
    },
    downProperty() {
      downProperty(this.property.id).then(() => {
        this._getPropertyList()
      })
    },
    submitPropertyModel() {
      this.$refs.propertyForm.validate(valid => {
        if (valid) {
          if (!this.propertyModel.id) {
            this.propertyModel.groupId = this.group.id
            insertProperty(this.propertyModel).then(() => {
              this._getPropertyList()
              this.propertyVisible = false
            })
          } else {
            updateProperty(this.propertyModel).then(() => {
              this._getPropertyList()
              this.propertyVisible = false
            })
          }
        }
      })
    },
    deletePropertyModel() {
      deleteProperty(this.propertyModel.id).then(() => {
        this._getPropertyList()
        this.deletePropertyVisible = false
      })
    },
    closePropertyForm() {
      this.$refs.propertyForm.clearValidate()
    },
    _getPropertyList() {
      getPropertyList(this.group.id).then(res => {
        this.propertyList = res.data
      })
    },
    _getGroupList() {
      getPropertyGroupList().then(res => {
        this.groupList = res.data
      })
    },
    _initData() {
      getPropertyGroupList().then(res => {
        this.groupList = res.data
        if (this.groupList.length > 0) {
          this.group = this.groupList[0]
          this._getPropertyList()
        }
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
    background #efefef
    .title
      font-weight bold
      line-height 50px
    .button-box
      position absolute
      top 11px
      right 11px
  .group
    position relative
    min-width 240px
    height 100%
    border-right 1px solid #ccc
    .custom-node
      display flex
      align-items center
      padding-left 28px
      width 100%
      height 40px
      font-size 14px
      cursor pointer
      &.active
        font-weight bold
        color white
        background #409eff !important
      &:hover
        background #d7eaff
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
    .property
      display flex
      align-items center
      justify-content space-around
      height 40px
      font-size 14px
      &.active
        color #409eff
        background #d7eaff !important
      &.title
        font-weight bold
        color white
        background #409eff !important
      &:hover
        background #d7eaff
      &:nth-child(even)
        background #efefef
        &:hover
          background #d7eaff
      div
        flex 1
        text-align center
</style>
