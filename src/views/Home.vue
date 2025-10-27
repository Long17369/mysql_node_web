<template>
  <div class="home">
    <h1>MySQL 数据管理系统</h1>
    <p class="subtitle">欢迎使用数据管理和可视化平台</p>
    
    <div class="cards">
      <router-link to="/users" class="card">
        <div class="card-icon">👥</div>
        <h2>用户管理</h2>
        <p>查看和管理用户数据</p>
      </router-link>

      <router-link to="/products" class="card">
        <div class="card-icon">📦</div>
        <h2>产品管理</h2>
        <p>查看和管理产品数据</p>
      </router-link>

      <router-link to="/orders" class="card">
        <div class="card-icon">🛒</div>
        <h2>订单管理</h2>
        <p>查看和管理订单数据</p>
      </router-link>

      <router-link to="/statistics" class="card">
        <div class="card-icon">📊</div>
        <h2>统计数据</h2>
        <p>查看数据分析和图表</p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  font-size: 1.2em;
  margin-bottom: 50px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  text-align: center;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.card h2 {
  font-size: 1.5em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.card p {
  color: #7f8c8d;
  line-height: 1.6;
}
</style>
