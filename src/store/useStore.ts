import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, BusinessInfo, WebsiteCustomization } from '../types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Business configuration
  businessInfo: BusinessInfo | null;
  websiteCustomization: WebsiteCustomization | null;
  
  // UI state
  isLoading: boolean;
  currentStep: number;
  selectedIndustry: string | null;
  selectedTemplate: string | null;
  selectedTemplateOption: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setBusinessInfo: (info: BusinessInfo) => void;
  setWebsiteCustomization: (customization: WebsiteCustomization) => void;
  setLoading: (loading: boolean) => void;
  setCurrentStep: (step: number) => void;
  setSelectedIndustry: (industry: string | null) => void;
  setSelectedTemplate: (template: string | null) => void;
  setSelectedTemplateOption: (option: string | null) => void;
  
  // Utility actions
  resetApp: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  businessInfo: null,
  websiteCustomization: null,
  isLoading: false,
  currentStep: 1,
  selectedIndustry: null,
  selectedTemplate: null,
  selectedTemplateOption: null,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setBusinessInfo: (businessInfo) => set({ businessInfo }),

      setWebsiteCustomization: (websiteCustomization) => set({ websiteCustomization }),

      setLoading: (isLoading) => set({ isLoading }),

      setCurrentStep: (currentStep) => set({ currentStep }),

      setSelectedIndustry: (selectedIndustry) => set({ selectedIndustry }),

      setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),

      setSelectedTemplateOption: (selectedTemplateOption) => set({ selectedTemplateOption }),

      resetApp: () => set(initialState),

      nextStep: () => {
        const { currentStep } = get();
        set({ currentStep: currentStep + 1 });
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },
    }),
    {
      name: 'bisnisbaik-store',
      partialize: (state) => ({
        user: state.user,
        businessInfo: state.businessInfo,
        websiteCustomization: state.websiteCustomization,
        selectedIndustry: state.selectedIndustry,
        selectedTemplate: state.selectedTemplate,
        selectedTemplateOption: state.selectedTemplateOption,
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useStore((state) => state.user);
export const useIsAuthenticated = () => useStore((state) => state.isAuthenticated);
export const useBusinessInfo = () => useStore((state) => state.businessInfo);
export const useWebsiteCustomization = () => useStore((state) => state.websiteCustomization);
export const useCurrentStep = () => useStore((state) => state.currentStep);
export const useSelectedIndustry = () => useStore((state) => state.selectedIndustry);
export const useSelectedTemplate = () => useStore((state) => state.selectedTemplate);
export const useSelectedTemplateOption = () => useStore((state) => state.selectedTemplateOption);
export const useIsLoading = () => useStore((state) => state.isLoading);
