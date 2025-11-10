<script setup lang="ts">
import { ref } from 'vue'

interface MenuItem {
  title: string
  submenuOpen?: boolean
  submenu?: { title: string; value: string }[]
}

interface Props {
  setActiveTab: (arg0: string) => void
}

defineProps<Props>()

const menuItems = ref<MenuItem[]>([
  {
    title: '数据管理',
    submenuOpen: true,
    submenu: [
      { title: '行为数据', value: 'behavior' },
      { title: '传感器数据', value: 'sensor' },
    ],
  },
  {
    title: '设备管理',
  },
  {
    title: '设置',
  },
])

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
        <div class="menu-title" @click="toggleSubmenu(item)">{{ item.title }}</div>
        <transition name="submenu-fade">
          <ul v-if="item.submenu" v-show="item.submenuOpen" class="submenu-list">
            <li v-for="subItem in item.submenu" :key="subItem.title" class="submenu-item">
              <div @click="() => setActiveTab(subItem.value)">{{ subItem.title }}</div>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<style>
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
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
}

.menu-title {
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
  padding: 6px 0;
  color: #555;
  cursor: pointer;
  font-size: 14px;
}

.menu-item:hover,
.submenu-item:hover {
  background-color: #f0f4fa;
}
</style>
