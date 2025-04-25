import {create} from 'zustand';

export enum ChatVariant {
    CHAT = "CHAT",
    COMMUNITY = "COMMUNITY",
  }

interface EnablechatsidebarObject {
    collapsed: boolean;
    onExpand: () => void;
    onCollapse: () => void;
    variant: ChatVariant;
    onChangeVariant: (variant: ChatVariant) => void;
};


export const useEnablechatsidebar = create<EnablechatsidebarObject>((set) => ({
    collapsed: false,
    variant: ChatVariant.CHAT,
    onChangeVariant: (variant: ChatVariant) => set(() => ({variant})),
    onExpand: () => set(() => ({collapsed: false})),
    onCollapse: () => set(() => ({collapsed: true})),
    
}));
