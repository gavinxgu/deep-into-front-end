import React from "react";
import { RecoilRoot, atom } from "recoil";

enum StateKey {
  todoListState,
}

const todoListState = atom({
  key: StateKey.todoListState.toString(),
  default: [],
});

const TodoList = function TodoList() {
  return <></>;
};

export const Recoil = function Recoil() {
  return (
    <RecoilRoot>
      <TodoList />
    </RecoilRoot>
  );
};
