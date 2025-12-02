<script setup lang="ts">
import { ref } from 'vue'

// 菜单项接口
interface MenuItem {
  type: 'MenuItem'
  title: string
  value: string
  submenuOpen: boolean
  submenu: SubMenuItem[] | MenuItem[]
}

// 子菜单项接口
interface SubMenuItem {
  type: 'SubMenuItem'
  title: string
  value: string
}

// 组件 Props
interface Props {
  setActiveTab: (arg0: string) => void
}

defineProps<Props>()

// 菜单项数据
const menuItems = ref<(MenuItem | SubMenuItem)[]>([
  {
    title: '数据管理',
    value: 'dataManger',
    type: 'MenuItem',
    submenuOpen: true,
    submenu: [
      { type: 'SubMenuItem', title: '实时数据', value: 'realtimeData' },
      { type: 'SubMenuItem', title: '历史数据', value: 'historyData' },
      { type: 'SubMenuItem', title: '错误数据', value: 'errorData' },
    ],
  },
  { type: 'SubMenuItem', title: '设备管理', value: 'deviceManger' },
  { type: 'SubMenuItem', title: '设备配置', value: 'deviceConfig' },
  { type: 'SubMenuItem', title: '设置', value: 'setting' },
])

// 切换子菜单展开/收起状态
function toggleSubmenu(item: MenuItem) {
  if (item.submenu) {
    item.submenuOpen = !item.submenuOpen
  }
}
</script>

<template>
  <div class="mainmenu">
    <ul class="menu-list">
      <li v-for="item in menuItems" :key="item.title" class="menu-item">
        <div
          v-if="item.type === 'SubMenuItem'"
          @click="() => setActiveTab(item.value)"
          class="submenu-item"
        >
          {{ item.title }}
        </div>
        <div v-else class="menu-title" @click="toggleSubmenu(item)">{{ item.title }}</div>
        <transition v-if="item.type === 'MenuItem'" name="submenu-fade">
          <ul v-if="item.submenu" v-show="item.submenuOpen" class="submenu-list">
            <li v-for="subItem in item.submenu" :key="subItem.title">
              <div class="submenu-item" @click="() => setActiveTab(subItem.value)">
                {{ subItem.title }}
              </div>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mainmenu {
  width: 200px;
  height: 100vh;
  background-color: #fff;
  border-right: 1px solid #eee;
  padding: 0;
  box-sizing: border-box;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  padding: 16px 24px;
  border-bottom: 1px solid #f5f5f5;
}

.menu-title {
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 8px;
  user-select: none;
}

.submenu-list {
  list-style: none;
  margin: 0;
  padding-left: 16px;
  overflow: hidden;
}

.submenu-fade-enter-active,
.submenu-fade-leave-active {
  transition: max-height 0.3s ease-in-out;
}

.submenu-fade-enter-from,
.submenu-fade-leave-to {
  max-height: 0;
}

.submenu-item {
  user-select: none;
  padding: 6px 0;
  color: #555;
  cursor: pointer;
  font-size: 14px;
}

.menu-title:hover,
.submenu-item:hover {
  background-color: #f0f4fa;
}
</style>
