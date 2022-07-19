import { writable } from "svelte/store";
import type { SvelteComponentTyped } from "svelte";
import { AccountPanel } from "./account";

export enum GuideTabs {
  AccountTab,
  MessagesTab,
  SettingsTab,
  ActivityTab,
  HistoryTab,
}

interface GuideState {
  open: boolean;
  canClose: boolean;
  routing: SvelteComponentTyped[];
  currTab: GuideTabs | null,
  currPage: number;
  data: never | null;
}

export const guide = writable<GuideState>({
  open: false,
  canClose: true,
  routing: [],
  currTab: null,
  currPage: 0,
  data: null,
});

export function open(): void {
  guide.update((state) => ({
    ...state,
    open: true,
    canClose: true,
    routing: [AccountPanel as never],
    currTab: GuideTabs.AccountTab,
    currPage: 0,
    data: null
  }));
}

export function close(): void {
  guide.update((state) => ({
    ...state,
    open: false,
    canClose: true,
    mainPage: null,
    routing: [],
    currTab: null,
    currPage: 0,
    data: null
  }));
}

export function nextPage(component: SvelteComponentTyped): void {
  guide.update((state) => {
    const newLength = state.routing.push(component);
    state.currPage = newLength - 1;
    return state;
  });
}

export function switchTab(component: SvelteComponentTyped, newTab: GuideTabs): void {
  guide.update((state) => {
    state.routing = [component];
    state.currPage = 0;
    state.currTab = newTab;
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
