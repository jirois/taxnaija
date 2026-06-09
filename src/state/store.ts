/**
 * store.ts — Zustand global filing state with localStorage persistence.
 */

import {create} from 'zustand'
import {persist, createJSONStorage } from 'zustand/middleware'
import type { EmploymentType } from '../tax-engine/types'


export type Language = 'en' | 'pidgin'
export type WizardStep = 1 | 2 | 3 | 4
export type SaveStatus = "idle" | "saving" | "saved" | "error"

export interface PersonalSlice {
    fullName: string; stateOfRes: string; employmentType: EmploymentType;
}

export interface IncomeSlice {
    monthlySalary?: number; annualSelfIncome?: number; otherAnnualIncome?: number;
}

export interface DeductionSlice {
    pensionContribution?: number; annualRentPaid?: number; lifeInsurancePremium?: number;
    nhfContribution?: number; nhisContribution?: number; includeNhf: boolean; includeNhis: boolean;
}

export interface UISlice {
    saveStatus: SaveStatus;
    modals: {pidginMode: boolean; saveProgress: boolean; download: boolean; penalty: boolean; reset: boolean; explainer: string | null}
}

export interface FilingStore {
    lang: Language; step: WizardStep; hasCompletedFiling: boolean
    personal: PersonalSlice; income: IncomeSlice; deductions: DeductionSlice; ui: UISlice;
    setLang: (l: Language) => void; setStep: (s: WizardStep) => void;
    nextStep: () => void; prevStep: () => void;
    updatePersonal: (p: Partial<PersonalSlice>) => void;
    updateIncome: (i: Partial<IncomeSlice>) => void;
    updateDeductions: (d: Partial<DeductionSlice>) => void;
    setSaveStatus: (s: SaveStatus) => void;
    openModal: (m: keyof UISlice['modals'], value?: string) => void;
    closeModal: (m: keyof UISlice['modals']) => void;
    markComplete: () => void; resetAll: () => void;

}

const IP: PersonalSlice = {fullName: "", stateOfRes: 'Lagos', employmentType: "employed"}
const II: IncomeSlice = {}
const ID: DeductionSlice = {includeNhf: false, includeNhis: false}
const IU: UISlice = {saveStatus: 'idle', modals: {pidginMode: false, saveProgress: false, download: false, penalty: false, reset: false, explainer: null}}

export const useFilingStore = create<FilingStore>()(
    persist(
        (set, get) => ({
            lang: 'en', step: 1, hasCompletedFiling: false,

            personal: IP, income: II, deductions: ID, ui: IU,

            setLang: (lang) => set({lang}),

            setStep: (step) => set({step}),

            nextStep: () => {const {step} = get(); if (step < 4) set({ step: (step + 1) as WizardStep}) },

            prevStep: () => {const {step} = get(); if (step > 1) set({step: (step - 1) as WizardStep })},

            updatePersonal: (patch) => {set(s => ({ personal: {...s.personal, ...patch}})); get().setSaveStatus('saved'); setTimeout(() => { get().setSaveStatus('saved'); setTimeout(() => get().setSaveStatus('idle'), 2700)}, 800)},

            updateIncome: (patch) => {set(s => ({income: {...s.income, ...patch}})); get().setSaveStatus('saving'); setTimeout(() => {get().setSaveStatus('saved'); setTimeout(() => get().setSaveStatus('idle'), 2700)}, 800)},

            updateDeductions: (patch) => {set(s => ({deductions: {...s.deductions, ...patch}})); get().setSaveStatus('saving'); setTimeout(() => { get().setSaveStatus('saved'); setTimeout(() => get().setSaveStatus('idle'), 2700)}, 800)},

            setSaveStatus: (saveStatus) => set(s => ({ui: {...s.ui, saveStatus}})),

            openModal: (modal, value) => set(s => ({ ui: {...s.ui, modals: {...s.ui.modals, [modal]: value ?? true}}})),

            closeModal: (modal) => set(s => ({ui: {...s.ui, modals: {...s.ui.modals, [modal]: modal === 'explainer' ? null : false}}})),

            markComplete: () => set({hasCompletedFiling: true}),

            resetAll: () => set({step: 1, hasCompletedFiling: false, personal: IP, income: II, deductions: ID, ui: IU})

        }),
        {
           name: 'taxnaija-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lang: s.lang, step: s.step, hasCompletedFiling: s.hasCompletedFiling, personal: s.personal, income: s.income, deductions: s.deductions }),  
        }
    )
)

export function selectTaxInput(s: FilingStore){
    return {
        income: {employmentType: s.personal.employmentType,
               monthlySalary: s.income.monthlySalary, annualSelfIncome: s.income.annualSelfIncome, otherAnnualIncome: s.income.otherAnnualIncome
        },
        deductions: {
            pensionContribution: s.deductions.pensionContribution, annualRentPaid: s.deductions.annualRentPaid, lifeInsurancePremium: s.deductions.lifeInsurancePremium, nhfContribution: s.deductions.includeNhf ? s.deductions.nhfContribution : undefined, nhisContribution: s.deductions.includeNhis ? s.deductions.nhisContribution : undefined
        },
        stateOfResidence: s.personal.stateOfRes,
    }
}

export const selectHasIncome = (s: FilingStore) => Boolean(s.income.monthlySalary || s.income.annualSelfIncome || s.income.otherAnnualIncome)