<script setup lang="ts">
import { computed } from 'vue';
import draggable from 'vuedraggable';
import TodoItem from './TodoItem.vue';
import { useTodoStore } from '../composables/useTodoStore';
import { useTodoDND } from '../composables/useTodoDND';
import type { ListType, Todo } from '../types/todo';
import { Plus, ArrowDownToLine } from 'lucide-vue-next';

const props = defineProps<{
  title: string;
  listType: ListType;
  metadata?: Partial<Todo>;
  todos: Todo[];
}>();

const { addTodo, deleteTodo, updateTodo } = useTodoStore();
const { onDragChange } = useTodoDND();

const sortedTodos = computed(() => [...props.todos].sort((a, b) => a.position - b.position));

const handleAdd = () => {
  const title = prompt('請輸入任務內容：');
  if (title) {
    const lastPos = sortedTodos.value[sortedTodos.value.length - 1]?.position ?? 0;
    addTodo(title, props.listType, lastPos + 1000, props.metadata);
  }
};

const handleChange = (e: any) => {
  onDragChange(e, props.listType, props.metadata);
};

const handleToggle = (id: string) => {
  const todo = props.todos.find(t => t.id === id);
  if (todo) {
    updateTodo(id, { completed: !todo.completed });
  }
};

const isStash = computed(() => props.listType === 'stash');
</script>

<template>
  <div class="list-column glass-panel" :class="{ 'stash-list': isStash }">
    <div class="list-header">
      <div class="header-main">
        <h3 class="gradient-text">{{ title }}</h3>
        <span class="count-badge">{{ todos.length }}</span>
      </div>
      
      <div class="actions">
        <button v-if="!isStash" @click="handleAdd" class="add-btn" title="新增任務">
          <Plus :size="18" />
          <span>新增</span>
        </button>
      </div>
    </div>

    <draggable
      class="todo-list"
      :list="sortedTodos"
      group="todos"
      item-key="id"
      handle=".drag-handle"
      @change="handleChange"
      :animation="200"
      ghost-class="ghost"
    >
      <template #item="{ element }">
        <TodoItem 
          :todo="element" 
          @toggle="handleToggle" 
          @delete="deleteTodo"
        />
      </template>
    </draggable>

    <div v-if="todos.length === 0" class="empty-state">
      <div v-if="isStash" class="stash-placeholder">
        <ArrowDownToLine :size="24" class="pulse-icon" />
        <p>請將任務拖曳至此暫存</p>
      </div>
      <p v-else>無待辦事項</p>
    </div>
  </div>
</template>

<style scoped>
.list-column {
  display: flex;
  flex-direction: column;
  min-width: 280px;
  height: 100%;
  max-height: 85vh;
  padding: 20px;
  background: rgba(15, 23, 42, 0.4);
  transition: all 0.3s ease;
  border: 1px solid var(--glass-border);
}

.stash-list {
  background: rgba(15, 23, 42, 0.6);
  border: 1px dashed var(--glass-border);
}

.list-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-header h3 {
  font-size: 1.25rem;
  margin: 0;
}

.count-badge {
  background: var(--glass-border);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  background: var(--accent-primary);
  color: white;
  border: none;
  width: fit-content;
  transition: all 0.2s ease;
}

.add-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(129, 140, 248, 0.3);
}

.todo-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px; /* 修正：增加內邊距，提供 Hover 縮放與陰影空間 */
  min-height: 0;
}

.ghost {
  opacity: 0.2;
  border: 2px dashed var(--accent-primary);
  background: transparent !important;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.stash-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0.6;
}

.pulse-icon {
  animation: pulse 2s infinite;
  color: var(--accent-primary);
}

@keyframes pulse {
  0% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(8px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.4; }
}

@media (max-width: 768px) {
  .list-column {
    min-width: 100%;
    max-height: none;
  }
}
</style>
