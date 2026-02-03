<script setup lang="ts">
import { CheckCircle2, Circle, GripVertical, Trash2 } from 'lucide-vue-next';
import type { Todo } from '../types/todo';

defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  (e: 'toggle', id: string): void;
  (e: 'delete', id: string): void;
}>();
</script>

<template>
  <div class="todo-item glass-panel hover-glow group" :class="{ 'completed': todo.completed }">
    <div class="drag-handle">
      <GripVertical :size="16" class="handle-icon" />
    </div>
    
    <button class="check-btn" @click="emit('toggle', todo.id)" :aria-label="todo.completed ? '標記為未完成' : '標記為已完成'">
      <div class="check-wrapper">
        <CheckCircle2 v-if="todo.completed" :size="22" class="checked-icon" />
        <Circle v-else :size="22" class="unchecked-icon" />
      </div>
    </button>

    <div class="content">
      <span class="title">{{ todo.title }}</span>
    </div>

    <button class="delete-btn" @click="emit('delete', todo.id)" title="刪除事項">
      <Trash2 :size="18" class="delete-icon" />
    </button>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  gap: 14px;
  margin-bottom: 10px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid var(--glass-border);
}

.todo-item:hover {
  transform: translateY(-2px) scale(1.01);
  background: rgba(45, 55, 75, 0.6);
  border-color: var(--accent-primary);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.4);
}

.todo-item.completed {
  opacity: 0.5;
  background: rgba(15, 23, 42, 0.2);
}

.todo-item.completed .title {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.check-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.check-btn:hover {
  transform: scale(1.2);
}

.check-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.checked-icon {
  color: #10b981; /* Emerald 500 */
  filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.4));
}

.unchecked-icon {
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.check-btn:hover .unchecked-icon {
  color: var(--accent-primary);
}

.content {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.delete-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  opacity: 0;
  transition: all 0.2s ease;
}

.todo-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(244, 63, 94, 0.1);
}

.delete-icon {
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.delete-btn:hover .delete-icon {
  color: #fb7185; /* Rose 400 */
  filter: drop-shadow(0 0 5px rgba(251, 113, 133, 0.4));
}

.drag-handle {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  opacity: 0.3;
  transition: opacity 0.2s ease;
}

.todo-item:hover .drag-handle {
  opacity: 1;
}

.handle-icon {
  cursor: grab;
}

.handle-icon:active {
  cursor: grabbing;
}
</style>
