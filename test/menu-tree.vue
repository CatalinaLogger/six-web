<template>
  <div class="tree-wrapper">
    <template v-for="item in treeData">

      <el-submenu :index="item.name" :key="item.id">

        <template slot="title" class="is-active">
          <svg-icon icon-class="user"></svg-icon>
          <span>{{item.name}}</span>
        </template>

        <template v-for="child in item.children">
          <tree-item v-if="child.children&&child.children.length>0" :treeData="[child]" :key="child.id"></tree-item>

          <el-menu-item v-else :index="child.name" :key="child.id">
            <svg-icon icon-class="user"></svg-icon>
            <span>{{child.name}}</span>
          </el-menu-item>

        </template>

      </el-submenu>

    </template>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'TreeItem',
  props: {
    treeData: {
      type: Array
    }
  }
}
</script>
