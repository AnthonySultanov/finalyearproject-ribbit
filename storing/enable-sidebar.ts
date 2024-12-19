import {create} from 'zustand';

interface EnableSidebarObject {
    collapsed: boolean;
    onExpand: () => void;
    onCollapse: () => void;
};


export const useEnableSidebar = create<EnableSidebarObject>((set) => ({
    collapsed: false,
    onExpand: () => set(() => ({collapsed: false})),
    onCollapse: () => set(() => ({collapsed: true})),
}));
