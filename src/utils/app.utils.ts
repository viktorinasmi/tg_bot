export const showList = (todos: any[]) => {
  return `Твой список задач: \n\n ${todos
    .map((todo) => (todo.isCompleted ? '✅' : '🔘') + ' ' + todo.name + '\n\n')
    .join('')}`;
};
