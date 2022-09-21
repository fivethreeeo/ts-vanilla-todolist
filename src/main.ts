import "./style.css";
import TodoStore from "./TodoStore";
import TodoView from "./TodoView";
import { v4 as uuid } from "uuid";

const todoListData = [
  { id: uuid(), content: "오늘 할 일1", completed: true },
  { id: uuid(), content: "오늘 할 일2", completed: true },
  { id: uuid(), content: "오늘 할 일3", completed: false },
  { id: uuid(), content: "오늘 할 일4", completed: false },
  { id: uuid(), content: "오늘 할 일5", completed: true },
  { id: uuid(), content: "오늘 할 일6", completed: true },
  { id: uuid(), content: "오늘 할 일7", completed: false },
  { id: uuid(), content: "오늘 할 일8", completed: false },
];

window.addEventListener("DOMContentLoaded", () => {
  const store = new TodoStore(todoListData);
  const view = new TodoView(store);
  view.init();
});
