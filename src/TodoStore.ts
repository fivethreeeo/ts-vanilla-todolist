import { v4 as uuid } from "uuid";

import { FilterStatus } from "./enums";
import { FilterType, Todo } from "./types";

export default class TodoStore {
  todoList: Todo[];

  constructor(todoList: Todo[]) {
    this.todoList = todoList;
  }

  getTodoListByFilter(filterType: FilterType): Todo[] {
    switch (filterType) {
      case FilterStatus.ALL:
        return this.todoList;

      case FilterStatus.COMPLETED:
        return this.todoList.filter((todo) => todo.completed);

      case FilterStatus.ISPROGRESS:
        return this.todoList.filter((todo) => !todo.completed);

      default:
        return this.todoList;
    }
  }

  getTargetIndex(targetId: Todo["id"]): number {
    const targetIndex = this.todoList.findIndex((todo) => todo.id === targetId);
    return targetIndex;
  }

  getTodo(id: Todo["id"]): Todo {
    const targetIndex = this.getTargetIndex(id);
    return { ...this.todoList[targetIndex] };
  }

  addTodo(content: Todo["content"]): void {
    const newTodo = { id: uuid(), content, completed: false };
    this.todoList.push(newTodo);
  }

  deleteTodo(id: Todo["id"]): void {
    const targetIndex = this.getTargetIndex(id);
    this.todoList.splice(targetIndex, 1);
  }

  updateTodo({ id, content, completed }: Todo) {
    const targetIndex = this.getTargetIndex(id);
    this.todoList[targetIndex] = {
      ...this.todoList[targetIndex],
      content,
      completed,
    };
  }
}
