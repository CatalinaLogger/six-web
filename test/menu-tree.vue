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
