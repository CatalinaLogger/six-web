<template>
  <div class="app-container fixed-none">
    <div class="category">
      <div class="header">
        <div class="title">单位分类</div>
      </div>
      <div class="custom-node" :class="{'active': 0 === category}" @click="categoryClick(0)">单单位</div>
      <div class="custom-node" :class="{'active': 1 === category}" @click="categoryClick(1)">多单位</div>
    </div>
    <el-scrollbar class="product" wrap-class="scrollbar-wrapper">
      <div class="header">
        <div class="title">单位列表 __ {{category ? '多单位' : '单单位'}}</div>
        <div class="button-box">
          <el-button type="success" size="mini" icon="el-icon-plus" @click="insertUnit">新增{{category ? '多单位' : '单单位'}}</el-button>
        </div>
      </div>
      <div class="unit title"><div>属性值</div><div>更新时间</div><div>更新人员</div><div>操作</div></div>
    </el-scrollbar>
    <el-dialog
      top="0"
      width="400px"
      :title="genTitle"
      :visible.sync="unitVisible"
      @close="closeUnitForm">
      <el-form :model="unitModel" :rules="unitRules" label-position="left" label-width="80px" ref="unitForm" style="margin: 0 20px">
        <div v-if="!category">
          <el-form-item label="单位名称" prop="name">
            <el-input v-model="unitModel.name"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="基本单位" prop="name">
            <el-input v-model="unitModel.name"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unitVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUnitModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUnitList, insertUnit, updateUnit, deleteUnit, upUnit, downUnit } from '@/api/datum'

export default {
  data() {
    return {
      category: 0,
      unitList: [],
      unitModel: {},
      unitRules: {name: [{required: true, message: '单位名称不能为空', trigger: 'blur'}]},
      unitTitle: '',
      unitVisible: false,
      deleteVisible: false,
      model: {name: '瓶瓶瓶瓶瓶瓶', conversion: 1, category: 1, children: [{name: '打打打打打', conversion: 10, category: 1}, {name: '箱', conversion: 40, category: 1}]}
    }
  },
  computed: {
    genTitle() {
      return this.unitTitle + (this.category ? '多单位' : '单单位')
    }
  },
  mounted() {
  },
  methods: {
    categoryClick(category) {
      this.category = category
    },
    insertUnit() {
      this.unitModel = {}
      this.unitTitle = '新增'
      this.unitVisible = true
    },
    updateUnit(unit) {
      Object.assign(this.unitModel, unit)
      this.unitTitle = '编辑'
      this.unitVisible = true
    },
    deleteUnit(unit) {
      Object.assign(this.unitModel, unit)
      this.deleteVisible = true
    },
    upUnit(unit) {
      upUnit(unit.id).then(() => {
        this._getUnitList()
      })
    },
    downUnit(unit) {
      downUnit(unit.id).then(() => {
        this._getUnitList()
      })
    },
    submitUnitModel() {
      this.$refs.unitForm.validate(valid => {
        if (valid) {
          if (!this.unitModel.id) {
            this.unitModel.category = this.category
            insertUnit(this.unitModel).then(() => {
              this._getUnitList()
              this.unitVisible = false
            })
          } else {
            updateUnit(this.unitModel).then(() => {
              this._getUnitList()
              this.unitVisible = false
            })
          }
        }
      })
    },
    deleteUnitModel() {
      deleteUnit(this.unitModel.id).then(() => {
        this._getUnitList()
        this.deleteVisible = false
      })
    },
    _getUnitList() {
      getUnitList().then(res => {
        this.unitList = res.data
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
  .category
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
  .product
    flex-grow 1
    min-width 400px
    height 100%
    .unit
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
