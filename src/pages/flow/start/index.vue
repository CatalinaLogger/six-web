<template>
  <div class="app-container none back">
    <el-row>
      <el-col class="category-option" :span="8" v-for="item in categoryFlow" :key="item.category">
        <div class="app-box">
          <title-line :title="mateCategory(item.category)" type="success"></title-line>
          <el-row class="process-option">
            <el-col :span="8" v-for="process in item.process" :key="process.id">
              <router-link class="button" tag="div" :to="{name: 'keep_' + process.key, params: {defineId: process.id, formKey: 'a'}}">
                <div class="icon-box"><svg-icon :icon-class="'flow-' + process.key" /></div>
                <p class="icon-text">{{process.name}}</p>
              </router-link>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import TitleLine from '@/components/title-line'
import { getConfDataTree } from '@/api/global'
import { getFlowList } from '@/api/flow'

export default {
  name: 'keep_start',
  data() {
    return {
      buttonList: [],
      categoryList: [],
      categoryFlow: []
    }
  },
  mounted() {
    this.buttonList = this.$route.meta.buttons
    this._getFlowCategory()
  },
  methods: {
    mateCategory(category) {
      return this.categoryList.filter(item => {
        return item.code === category
      })[0].name
    },
    _getFlowCategory() {
      getConfDataTree('ProcessType').then(res => {
        this.categoryList = res.data
        this._getCategoryList()
      })
    },
    _getCategoryList() {
      getFlowList(null, null, true).then(res => {
        let map = {}
        res.data.forEach((item) => {
          const key = item.category
          if (!map[key]) {
            map[key] = {
              category: key,
              process: []
            }
          }
          map[key].process.push(item)
        })
        for (let key in map) {
          this.categoryFlow.push(map[key])
        }
      })
    }
  },
  components: {
    TitleLine
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.app-container
  padding 10px
  .category-option
    position relative
    padding 10px
    .app-box
      background white
    .title-line
      margin 0 10px
    .process-option
      padding 50px 10px 10px 10px
      .button
        position relative
        margin 0 auto
        padding-top 10px
        width 100px
        text-align center
        cursor pointer
        .icon-box
          margin auto
          width 70px
          height 70px
          color white
          background #66b1ff
          border-radius 8px
          .svg-icon
            margin-top 10px
            font-size 50px
        .icon-text
          font-size 13px
          color #909399
        &:hover
          .icon-box
            background #409eff
          .icon-text
            color #606266
        &:active
          top 4px
</style>
