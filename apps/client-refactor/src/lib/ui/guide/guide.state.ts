import { writable } from "svelte/store";
import type { SvelteComponent } from "svelte";

interface GuideState {
  open: boolean;
  canClose: boolean;
  routing: SvelteComponent[];
  currPage: number;
  data: any;
}

export const guide = writable<GuideState>({
  open: false,
  canClose: true,
  routing: [],
  currPage: 0,
  data: null
});

export function open(component: SvelteComponent): void {
  guide.update((state) => ({
    ...state,
    open: true,
    canClose: true,
    routing: [component],
    currPage: 0,
    data: null
  }));
}

export function close(): void {
  guide.update((state) => ({
    ...state,
    open: false,
    canClose: true,
    routing: [],
    currPage: 0,
    data: null
  }));
}

export function nextPage(component: SvelteComponent): void {
  guide.update((state) => {
    const newLength = state.routing.push(component);
    state.currPage = newLength - 1;
    return state;
  });
}

export function prevPage(): void {
  guide.update((state) => {
    state.routing.pop();
    state.currPage = state.routing.length - 1;
    if (state.routing.length === 1) {
      state.canClose = true;
    }
    return state;
  });
}

export function refresh(component: SvelteComponent): void {
  close();
  open(component);
}