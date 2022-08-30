import "./style.css";
import { v4 as uuid } from "uuid";

const enum FilterStatus {
  ALL = "all",
  COMPLETED = "completed",
  ISPROGRESS = "isProgress",
}

type FilterType = `${FilterStatus}`;

interface Todo {
  id: string;
  content: string;
  completed: boolean;
}

class TodoStore {
  todoList: Todo[];

  constructor() {
    this.todoList = [
      { id: uuid(), content: "오늘 할 일1", completed: true },
      { id: uuid(), content: "오늘 할 일2", completed: true },
      { id: uuid(), content: "오늘 할 일3", completed: false },
      { id: uuid(), content: "오늘 할 일4", completed: false },
      { id: uuid(), content: "오늘 할 일5", completed: true },
      { id: uuid(), content: "오늘 할 일6", completed: true },
      { id: uuid(), content: "오늘 할 일7", completed: false },
      { id: uuid(), content: "오늘 할 일8", completed: false },
    ];
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

class TodoView {
  store: TodoStore;
  currentFilter: FilterType;
  inputEl: HTMLInputElement;
  itemsEl: HTMLElement;
  controlsEl: HTMLElement;

  constructor(store: TodoStore) {
    this.store = store;
    this.currentFilter = FilterStatus.ALL;

    this.inputEl = <HTMLInputElement>document.querySelector(".todo-input");
    this.itemsEl = <HTMLElement>document.querySelector(".todo-items");
    this.controlsEl = <HTMLElement>document.querySelector(".todo-controls");
  }

  init() {
    this.initEvents();
    this.render();
    this.inputEl.focus();
  }

  initEvents() {
    this.inputEl.addEventListener("keydown", this.onInputEnter.bind(this));
    this.controlsEl.addEventListener("click", this.onControlsClick.bind(this));
    this.itemsEl.addEventListener("click", (event) => {
      switch ((<HTMLElement>event.target).className) {
        case "item-deleteBtn":
          this.onDeleteButtonClick(event);
          return;

        case "item-checkbox":
          this.onCheckboxClick(event);
          return;

        default:
          return;
      }
    });

    this.itemsEl.addEventListener(
      "focusout",
      this.onContentFocusout.bind(this)
    );
  }

  onInputEnter(event: KeyboardEvent) {
    if (
      event.key !== "Enter" ||
      !(event.target instanceof HTMLInputElement) ||
      !event.target.value.trim()
    )
      return;

    this.store.addTodo(event.target.value);
    this.inputEl.value = "";

    this.render();
  }

  onControlsClick({ target }: MouseEvent) {
    if (
      !(target instanceof HTMLButtonElement) ||
      target.classList.contains("active")
    )
      return;

    const selectedFilter = <FilterType>target.className;
    this.currentFilter = selectedFilter;

    const prev = this.controlsEl.querySelector(".active");
    prev?.classList.remove("active");
    target.classList.add("active");

    this.render();
  }

  onDeleteButtonClick({ target }: MouseEvent) {
    if (!(target instanceof HTMLButtonElement)) return;

    const targetId = (<HTMLDivElement>target.parentElement).dataset.id;
    targetId && this.store.deleteTodo(targetId);

    this.render();
  }

  onCheckboxClick({ target }: MouseEvent) {
    if (!(target instanceof HTMLInputElement)) return;

    const id = <Todo["id"]>target.parentElement?.dataset.id;

    const prevTodo = this.store.getTodo(id);
    const updatedTodo = {
      ...prevTodo,
      completed: target.checked,
    };

    this.store.updateTodo(updatedTodo);

    this.render();
  }

  onContentFocusout({ target }: FocusEvent) {
    if (!(target instanceof HTMLSpanElement)) return;

    const id = <Todo["id"]>target.parentElement?.dataset.id;

    const prevTodo = this.store.getTodo(id);
    const updatedTodo: Todo = {
      ...prevTodo,
      content: <Todo["content"]>target.textContent,
    };

    this.store.updateTodo(updatedTodo);
  }

  render() {
    const lastestList = this.store.getTodoListByFilter(this.currentFilter);

    const todoListHTML = lastestList.reduce(
      (HTML, item) => (HTML += this.templateItemHTML(item)),
      ""
    );

    this.itemsEl.innerHTML = todoListHTML;
  }

  templateItemHTML(todo: Todo) {
    return `<div data-id="${todo.id}" class="todo-item">
        <input class="item-checkbox" type="checkbox" ${
          todo.completed ? "checked" : ""
        }/>
        <span class="item-content" contenteditable>${todo.content}</span>
        <button class="item-deleteBtn">X</button>
      </div>`;
  }
}

const store = new TodoStore();
const view = new TodoView(store);
view.init();
