import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { expandSectionSlice, type ExpandSectionSlice } from './slices/expandSectionSlice';
import { mergeSlices } from './storeSlices';

export type MassiviAppState = {
    expandSection: ExpandSectionSlice;
};

export const StoreSlices = {
    EXPAND_SECTION: 'expandSection'
} as const;

export type StoreSlices = (typeof StoreSlices)[keyof typeof StoreSlices];

export const useMassiviAppStore = create<MassiviAppState>()(
    devtools(
        persist(
            (...args) => ({
                expandSection: expandSectionSlice(...args)
            }),
            {
                name: 'massivi-store',
                merge: (persistedState, currentState: MassiviAppState) =>
                    mergeSlices(persistedState as MassiviAppState, currentState)
            }
        )
    )
);
