import { useTodoStore } from './useTodoStore';
import { calculatePosition } from '../utils/position';
import type { ListType, Todo } from '../types/todo';

export function useTodoDND() {
    const { state, updateTodo } = useTodoStore();

    function onDragChange(event: any, newListType: ListType, metadata: Partial<Todo> = {}) {
        if (event.added) {
            const { element, newIndex } = event.added;

            // Get neighbors to calculate position
            const list = getSortedList(newListType, metadata);
            const prev = list[newIndex - 1];
            const next = list[newIndex];

            const newPosition = calculatePosition(prev?.position, next?.position);

            updateTodo(element.id, {
                listType: newListType,
                position: newPosition,
                ...metadata // Update date or weekday if needed
            });
        }

        if (event.moved) {
            const { element, newIndex } = event.moved;

            const list = getSortedList(newListType, metadata);
            // Since it's moved, the list already contains the element at oldIndex
            // We need to calculate based on the target position

            // Adjust neighbors skipping the moved element itself if needed
            // Actually vuedraggable's list after move is updated, so we can just look at neighbors
            const filteredList = list.filter(t => t.id !== element.id);
            const prev = filteredList[newIndex - 1];
            const next = filteredList[newIndex];

            const newPosition = calculatePosition(prev?.position, next?.position);

            updateTodo(element.id, {
                position: newPosition,
                ...metadata
            });
        }
    }

    function getSortedList(listType: ListType, metadata: Partial<Todo> = {}) {
        return state.todos
            .filter(t => {
                if (t.listType !== listType) return false;
                if (listType === 'weekly') return t.weekday === metadata.weekday;
                if (listType === 'monthly') return t.date === metadata.date;
                return true;
            })
            .sort((a, b) => a.position - b.position);
    }

    return {
        onDragChange,
        getSortedList
    };
}
