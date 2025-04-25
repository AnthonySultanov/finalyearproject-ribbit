import {create} from 'zustand';

interface EnableDashboardSidebarObject {
    collapsed: boolean;
    onExpand: () => void;
    onCollapse: () => void;
};


export const useEnableDashboardSidebar = create<EnableDashboardSidebarObject>((set) => ({
    collapsed: false,
    onExpand: () => set(() => ({collapsed: false})),
    onCollapse: () => set(() => ({collapsed: true})),
}));
