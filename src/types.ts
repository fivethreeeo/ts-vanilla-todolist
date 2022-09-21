import { FilterStatus } from "./enums";

type FilterType = `${FilterStatus}`;

interface Todo {
  id: string;
  content: string;
  completed: boolean;
}

export type { FilterType, Todo };
