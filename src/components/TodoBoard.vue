<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
import { useTodoStore } from '../composables/useTodoStore';
import TodoList from './TodoList.vue';
import { getCalendarDaysOfMonth } from '../utils/data';
import { 
  Inbox, 
  CalendarDays, 
  LayoutGrid, 
  Archive,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Trash2,
  Download
} from 'lucide-vue-next';

type ViewType = 'general' | 'weekly' | 'monthly';

const { state, clearCompleted } = useTodoStore();
const currentView = ref<ViewType>('general');
const isMobileMenuOpen = ref(false);

const installPWA = inject('installPWA') as () => void;
const canInstall = inject('canInstall') as any;

const weekdays = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

// 資料篩選邏輯
const generalTodos = computed(() => state.todos.filter(t => t.listType === 'general'));
const stashTodos = computed(() => state.todos.filter(t => t.listType === 'stash'));

const getWeeklyTodos = (day: number) => {
  return state.todos.filter(t => t.listType === 'weekly' && t.weekday === day);
};

const getMonthlyTodos = (date: string | null) => {
  return state.todos.filter(t => t.listType === 'monthly' && t.date === date);
};

const monthlyDays = computed(() => getCalendarDaysOfMonth(calendarYear.value, calendarMonth.value));
const calendarYear = ref(new Date().getFullYear());
const calendarMonth = ref(new Date().getMonth());

// 限制範圍邏輯
const today = new Date();
const currentTotalMonths = today.getFullYear() * 12 + today.getMonth();

const canGoPrev = computed(() => {
  const targetTotalMonths = calendarYear.value * 12 + calendarMonth.value;
  return targetTotalMonths > currentTotalMonths - 1;
});

const canGoNext = computed(() => {
  const targetTotalMonths = calendarYear.value * 12 + calendarMonth.value;
  return targetTotalMonths < currentTotalMonths + 1;
});

const monthHeaderName = computed(() => {
  return `${calendarYear.value}年 ${calendarMonth.value + 1}月`;
});

const prevMonth = () => {
  if (!canGoPrev.value) return;
  if (calendarMonth.value === 0) {
    calendarYear.value--;
    calendarMonth.value = 11;
  } else {
    calendarMonth.value--;
  }
};

const nextMonth = () => {
  if (!canGoNext.value) return;
  if (calendarMonth.value === 11) {
    calendarYear.value++;
    calendarMonth.value = 0;
  } else {
    calendarMonth.value++;
  }
};

const setView = (view: ViewType) => {
  currentView.value = view;
  isMobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const handleResize = () => {
  if (window.innerWidth > 1024) {
    isMobileMenuOpen.value = false;
  }
};

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));
</script>

<template>
  <div class="app-layout" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <!-- Mobile Header -->
    <header class="mobile-header glass-panel">
      <button class="menu-toggle" @click="toggleMobileMenu">
        <Menu v-if="!isMobileMenuOpen" :size="24" />
        <X v-else :size="24" />
      </button>
      <div class="logo-compact">
        <img src="/logo.png" alt="WEDO Logo" class="logo-img-compact" />
        <h1 class="gradient-text">WEDO</h1>
      </div>
      <div class="header-action-placeholder"></div>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar glass-panel" :class="{ 'drawer-open': isMobileMenuOpen }">
      <div class="sidebar-inner">
        <div class="logo">
          <img src="/logo.png" alt="WEDO Logo" class="logo-img" />
          <h1 class="gradient-text">WEDO</h1>
        </div>

        <nav class="nav-menu">
          <button class="nav-item" :class="{ active: currentView === 'general' }" @click="setView('general')">
            <Inbox :size="20" />
            <span>一般清單</span>
            <ChevronRight v-if="currentView === 'general'" :size="16" class="active-indicator" />
          </button>

          <button class="nav-item" :class="{ active: currentView === 'weekly' }" @click="setView('weekly')">
            <LayoutGrid :size="20" />
            <span>每週任務</span>
            <ChevronRight v-if="currentView === 'weekly'" :size="16" class="active-indicator" />
          </button>

          <button class="nav-item" :class="{ active: currentView === 'monthly' }" @click="setView('monthly')">
            <CalendarDays :size="20" />
            <span>每月計畫</span>
            <ChevronRight v-if="currentView === 'monthly'" :size="16" class="active-indicator" />
          </button>
        </nav>

        <div class="sidebar-footer">
          <!-- Install PWA Button -->
          <button v-if="canInstall" @click="installPWA" class="install-pwa-btn">
            <Download :size="18" />
            <span>安裝應用程式</span>
          </button>

          <div class="reset-info">
            <div v-if="currentView === 'weekly'" class="footer-info-item">
              <small>每週重置基準：</small>
              <span>週一</span>
            </div>
            <div class="footer-info-item">
              <small>今日日期：</small>
              <span>{{ new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="content-header desktop-only">
        <div class="header-main-group">
          <h2 class="view-title">
            <span v-if="currentView === 'general'">一般清單 / General</span>
            <span v-if="currentView === 'weekly'">每週任務 / Weekly</span>
            <span v-if="currentView === 'monthly'">每月計畫 / Monthly</span>
          </h2>

          <button @click="clearCompleted(currentView)" class="global-clear-btn">
            <Trash2 :size="16" />
            <span>清除所有已完成</span>
          </button>
        </div>
      </header>

      <div class="view-container">
        <div class="main-area">
          <!-- General View -->
          <div v-if="currentView === 'general'" class="single-list-view">
            <TodoList title="General" listType="general" :todos="generalTodos" />
          </div>

          <!-- Weekly View -->
          <div v-if="currentView === 'weekly'" class="weekly-view-scroll">
            <div class="weekly-flex-container">
              <div v-for="(day, index) in weekdays" :key="day" class="day-column-wrapper">
                <TodoList :title="day" listType="weekly" :todos="getWeeklyTodos(index)" :metadata="{ weekday: index }" />
              </div>
            </div>
          </div>

          <!-- Monthly View - 改為當月月曆網格 (Flex 換行模式) -->
          <div v-if="currentView === 'monthly'" class="monthly-view-calendar">
            <div class="calendar-header-info">
        <div class="month-nav">
          <button class="nav-arrow-btn" @click="prevMonth" :disabled="!canGoPrev" :class="{ disabled: !canGoPrev }" title="上個月">
            <ChevronLeft :size="20" />
          </button>
          <span class="calendar-month-title">{{ monthHeaderName }}</span>
          <button class="nav-arrow-btn" @click="nextMonth" :disabled="!canGoNext" :class="{ disabled: !canGoNext }" title="下個月">
            <ChevronRight :size="20" />
          </button>
        </div>
              <div class="calendar-legend">
                <span class="legend-item"><span class="legend-dot today"></span> 今日</span>
              </div>
            </div>
            
            <div class="calendar-flex-container">
              <!-- 正式日期格子 -->
              <div 
                v-for="day in monthlyDays" 
                :key="day.date" 
                class="calendar-cell"
                :class="{ 'is-today': day.isToday }"
              >
                <div class="cell-date-info">
                  <span class="day-num">{{ day.dayNumber }}</span>
                  <span class="day-weekday">{{ ['日', '一', '二', '三', '四', '五', '六'][day.weekday] }}</span>
                </div>
                <TodoList :title="''" listType="monthly" :todos="getMonthlyTodos(day.date)" :metadata="{ date: day.date }" />
              </div>
            </div>
          </div>
        </div>

        <!-- Permanent Stash Area -->
        <aside class="stash-area">
          <div class="stash-header">
            <Archive :size="18" />
            <span>暫存區 / Stash</span>
          </div>
          <TodoList title="Stash" listType="stash" :todos="stashTodos" />
        </aside>
      </div>
    </main>

    <div v-if="isMobileMenuOpen" class="mobile-overlay" @click="toggleMobileMenu"></div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-color);
  overflow: hidden;
  position: relative;
}

.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  border-radius: 0;
  border-bottom: 1px solid var(--glass-border);
}

.logo-compact { display: flex; align-items: center; }
.logo-compact h1 { font-size: 1rem; letter-spacing: 2px; }
.logo-img-compact { width: 24px; height: 24px; margin-right: 8px; object-fit: contain; }
.menu-toggle { background: none; border: none; color: var(--text-primary); display: flex; align-items: center; }

.sidebar {
  width: 280px;
  height: 100%;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  z-index: 150;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-inner { display: flex; flex-direction: column; height: 100%; padding: 30px 20px; }
.logo { display: flex; align-items: center; gap: 12px; margin-bottom: 50px; padding-left: 10px; }
.logo-img { width: 32px; height: 32px; border-radius: 8px; object-fit: contain; }
.logo h1 { font-size: 1.25rem; margin: 0; }

.nav-menu { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 15px; padding: 14px 18px; border-radius: 12px; background: transparent; border: 1px solid transparent; color: var(--text-secondary); transition: all 0.2s ease; text-align: left; }
.nav-item:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
.nav-item.active { background: rgba(129, 140, 248, 0.1); border-color: rgba(129, 140, 248, 0.2); color: var(--accent-primary); }
.active-indicator { margin-left: auto; }

.sidebar-footer { margin-top: auto; padding: 15px 10px; border-top: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 15px; }

.install-pwa-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 10px; border-radius: 10px;
  background: rgba(129, 140, 248, 0.1); border: 1px solid rgba(129, 140, 248, 0.2);
  color: var(--accent-primary); font-weight: 500; font-size: 0.9rem;
  transition: all 0.2s ease;
}
.install-pwa-btn:hover { background: rgba(129, 140, 248, 0.2); transform: translateY(-1px); }

.reset-info { display: flex; flex-direction: column; gap: 4px; color: var(--text-secondary); }
.reset-info small { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; }

.main-content { flex: 1; display: flex; flex-direction: column; padding: 40px; overflow: hidden; position: relative; }
.content-header { margin-bottom: 30px; }
.header-main-group { display: flex; align-items: center; justify-content: space-between; width: 100%; }

.global-clear-btn {
  display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 10px; font-size: 0.9rem; font-weight: 500;
  border: 1px solid var(--glass-border); background: rgba(244, 63, 94, 0.05); color: #fb7185; transition: all 0.3s ease; cursor: pointer;
}
.global-clear-btn:hover { background: rgba(244, 63, 94, 0.15); border-color: rgba(244, 63, 94, 0.4); transform: translateY(-1px); }

.view-title { font-size: 1.8rem; font-weight: 700; }
.view-container { display: flex; gap: 24px; flex: 1; overflow: hidden; min-height: 0; }
.main-area { flex: 3; overflow-y: auto; display: flex; flex-direction: column; padding-right: 10px; min-height: 0; }

.weekly-view-scroll { width: 100%; }
.weekly-flex-container { display: flex; flex-wrap: wrap; gap: 20px; width: 100%; }
.day-column-wrapper { flex: 1 1 300px; max-width: 450px; min-height: 400px; }

/* Monthly Calendar Styles */
.monthly-view-calendar { display: flex; flex-direction: column; gap: 20px; height: 100%; }
.calendar-header-info { display: flex; align-items: center; justify-content: space-between; padding: 0 5px; }
.month-nav { display: flex; align-items: center; gap: 20px; padding: 5px; }
.nav-arrow-btn { 
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); 
  color: var(--text-secondary); width: 36px; height: 36px; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; cursor: pointer;
}
.nav-arrow-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: var(--text-primary); border-color: rgba(255, 255, 255, 0.2); transform: scale(1.1); box-shadow: 0 0 10px rgba(129, 140, 248, 0.2); }
.nav-arrow-btn:active:not(:disabled) { transform: scale(0.95); }
.nav-arrow-btn:disabled, .nav-arrow-btn.disabled { opacity: 0.3; cursor: not-allowed; transform: none; pointer-events: none; border-color: transparent; }

.calendar-month-title { font-size: 1.4rem; color: var(--text-primary); font-weight: 700; min-width: 150px; text-align: center; }
.calendar-legend { display: flex; gap: 15px; font-size: 0.8rem; color: var(--text-secondary); }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px; }
.legend-dot.today { background: var(--accent-primary); box-shadow: 0 0 10px var(--accent-primary); }

.calendar-grid-labels { display: none; }

.calendar-flex-container { display: flex; flex-wrap: wrap; gap: 15px; width: 100%; }

.calendar-cell {
  flex: 1 1 300px; max-width: 450px;
  background: rgba(15, 23, 42, 0.4); border: 1px solid var(--glass-border); border-radius: 12px;
  min-height: 220px; display: flex; flex-direction: column; transition: all 0.3s ease; overflow: hidden;
}
.calendar-cell.is-today { border-color: var(--accent-primary); background: rgba(129, 140, 248, 0.05); box-shadow: inset 0 0 20px rgba(129, 140, 248, 0.1); }

.cell-date-info { padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 5px; }
.day-num { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); }
.day-weekday { font-size: 0.75rem; color: var(--text-secondary); opacity: 0.8; }
.day-num { font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.is-today .day-num { background: var(--accent-primary); color: white; }

.stash-area { flex: 0 0 320px; display: flex; flex-direction: column; gap: 15px; overflow: hidden; }
.stash-header { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); }

@media (max-width: 1440px) { .calendar-cell { min-height: 150px; } }
@media (max-width: 1200px) {
  .mobile-header { display: flex; }
  .sidebar { position: fixed; top: 0; left: 0; bottom: 0; transform: translateX(-100%); }
  .sidebar.drawer-open { transform: translateX(0); }
  .main-content { padding: 80px 20px 20px; }
  .desktop-only { display: none; }
  .view-container { flex-direction: column; height: calc(100vh - 100px); min-height: 0; }
  .main-area { flex: 1; min-height: 0; overflow-y: auto; }
  .stash-area { 
    flex: 0 0 35vh !important; 
    height: 35vh !important; 
    min-height: 35vh !important;
    max-height: 35vh !important; 
    overflow: hidden;
  }
  .stash-area .list-column {
    height: 100% !important;
    max-height: 100% !important;
    min-height: 0 !important;
  }
  .calendar-flex-container { grid-template-columns: 1fr; }
}

.mobile-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); z-index: 120; }
</style>
