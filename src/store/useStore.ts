import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { expandSectionSlice, type AnchorValidationSlice } from './slices/anchorValidationSectionSlice';
import { mergeSlices } from './storeSlices';

export type MassiviAppState = {
    anchorValidationSection: AnchorValidationSlice;
};

export const StoreSlices = {
    ANCHOR_VALIDATION_SECTION: 'anchorValidationSection'
} as const;

export type StoreSlices = (typeof StoreSlices)[keyof typeof StoreSlices];

export const useMassiviAppStore = create<MassiviAppState>()(
    devtools(
        persist(
            (...args) => ({
                anchorValidationSection: expandSectionSlice(...args)
            }),
            {
                name: 'massivi-store',
                merge: (persistedState, currentState: MassiviAppState) =>
                    mergeSlices(persistedState as MassiviAppState, currentState)
            }
        )
    )
);
