import { TaskEntity } from '../task.entity';

export const showList = (todos: TaskEntity[]) => {
  return `Твой список задач:\n\n ${todos
    .map((todo) => (todo.isCompleted ? '✅' : '🔘') + ' ' + todo.name + '\n\n')
    .join('')}`;
};
// const isCompleted = (state: boolean) => (state ? '✅ ' : '🔘');
// const todoList = todos.map(
// );
// const showList = `Твой список задач: \n\n ${todoList.join(' ')}`;
