import { reactive, watch } from 'vue';
import type { Todo, ListType } from '../types/todo';
import { isNewWeek } from '../utils/data';

interface TodoState {
    todos: Todo[];
    lastWeeklyReset: number;
}

const STORAGE_KEY = 'antigravity_todo_state';

function loadState(): TodoState {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                return {
                    todos: Array.isArray(parsed.todos) ? parsed.todos : [],
                    lastWeeklyReset: typeof parsed.lastWeeklyReset === 'number' ? parsed.lastWeeklyReset : Date.now(),
                };
            }
        }
    } catch (e) {
        console.error('Failed to load state', e);
    }
    return {
        todos: [],
        lastWeeklyReset: Date.now(),
    };
}

const state = reactive<TodoState>(loadState());

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

watch(state, saveState, { deep: true });

function generateId(): string {
    const cryptoObj = (globalThis as any).crypto;
    if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
        return cryptoObj.randomUUID();
    }
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function useTodoStore() {

    function checkWeeklyReset() {
        if (isNewWeek(state.lastWeeklyReset)) {
            state.todos.forEach(todo => {
                if (todo.listType === 'weekly') {
                    todo.completed = false;
                }
            });
            state.lastWeeklyReset = Date.now();
        }
    }

    function addTodo(title: string, listType: ListType, position: number, metadata: Partial<Todo> = {}) {
        const newTodo: Todo = {
            id: generateId(),
            title: title || 'New Task',
            completed: false,
            listType: listType || 'general',
            position: typeof position === 'number' ? position : 1000,
            weekday: metadata.weekday !== undefined ? metadata.weekday : null,
            date: metadata.date !== undefined ? metadata.date : null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        state.todos.push(newTodo);
    }

    function updateTodo(id: string, updates: Partial<Todo>) {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
            // Safely update properties to avoid assigning undefined to required fields
            (Object.keys(updates) as (keyof Todo)[]).forEach(key => {
                const value = updates[key];
                if (value !== undefined) {
                    (todo as any)[key] = value;
                }
            });
            todo.updatedAt = Date.now();
        }
    }

    function deleteTodo(id: string) {
        const index = state.todos.findIndex(t => t.id === id);
        if (index !== -1) {
            state.todos.splice(index, 1);
        }
    }

    function pruneMonthlyTodos() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // 合法範圍：上月(-1), 本月(0), 下月(+1)
        const validMonths = [
            new Date(currentYear, currentMonth - 1, 1),
            new Date(currentYear, currentMonth, 1),
            new Date(currentYear, currentMonth + 1, 1)
        ].map(d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);

        state.todos = state.todos.filter(todo => {
            if (todo.listType !== 'monthly' || !todo.date) return true;
            // 比對 YYYY-MM 部分
            const todoYearMonth = todo.date.substring(0, 7);
            return validMonths.includes(todoYearMonth);
        });
    }

    function clearCompleted(listType: ListType) {
        state.todos = state.todos.filter(todo => {
            const isTargetType = todo.listType === listType || todo.listType === 'stash';
            return !(isTargetType && todo.completed);
        });
    }

    checkWeeklyReset();
    pruneMonthlyTodos();

    return {
        state,
        addTodo,
        updateTodo,
        deleteTodo,
        clearCompleted,
        checkWeeklyReset,
    };
}
