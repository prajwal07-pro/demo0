import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  MapViewState,
  MapLayer,
  AISVessel,
  MarineAlert,
  ChatConversation,
  User,
} from '@/types';
import type { OceanLayerId, VesselTypeId } from '@/lib/constants';
import { MAP_DEFAULTS } from '@/lib/constants';

// ---------- UI State ----------
export type ThemePreference = 'dark' | 'light' | 'system';

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  commandPaletteOpen: boolean;
  mobileNavOpen: boolean;
  activeModal: string | null;
  toast: { message: string; type: 'info' | 'success' | 'warning' | 'error' } | null;
  /**
   * Theme preference — the canonical source of truth for the visual mode.
   * It is intentionally decoupled from `user.preferences.theme` so that
   * guests (no authenticated user) can still switch themes and the choice
   * persists across refreshes.
   */
  theme: ThemePreference;
}

// ---------- Map State ----------
interface MapState {
  viewState: MapViewState;
  layers: MapLayer[];
  selectedVessel: AISVessel | null;
  hoveredVessel: AISVessel | null;
  activeLayers: OceanLayerId[];
  vesselFilter: VesselTypeId[];
  timeRange: { start: string; end: string };
  isPlaying: boolean;
  playbackSpeed: number;
}

// ---------- Data State ----------
interface DataState {
  vessels: AISVessel[];
  alerts: MarineAlert[];
  lastUpdate: string | null;
  isLoading: boolean;
  error: string | null;
}

// ---------- Chat State ----------
interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
}

// ---------- User State ----------
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

// ---------- App Store ----------
export interface AppStore extends UIState, MapState, DataState, ChatState, UserState {
  // UI
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleCommandPalette: () => void;
  toggleMobileNav: () => void;
  setActiveModal: (modal: string | null) => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  clearToast: () => void;
  setTheme: (theme: ThemePreference) => void;

  // Map
  setViewState: (viewState: Partial<MapViewState>) => void;
  setLayers: (layers: MapLayer[]) => void;
  toggleLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setSelectedVessel: (vessel: AISVessel | null) => void;
  setHoveredVessel: (vessel: AISVessel | null) => void;
  setActiveLayers: (layers: OceanLayerId[]) => void;
  setVesselFilter: (types: VesselTypeId[]) => void;
  setTimeRange: (range: { start: string; end: string }) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;

  // Data
  setVessels: (vessels: AISVessel[]) => void;
  setAlerts: (alerts: MarineAlert[]) => void;
  setLastUpdate: (timestamp: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Chat
  setConversations: (conversations: ChatConversation[]) => void;
  addConversation: (conversation: ChatConversation) => void;
  setActiveConversation: (id: string | null) => void;
  updateConversation: (id: string, updates: Partial<ChatConversation>) => void;
  setIsStreaming: (streaming: boolean) => void;

  // User
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

const initialState = {
  sidebarOpen: true,
  rightPanelOpen: true,
  commandPaletteOpen: false,
  mobileNavOpen: false,
  activeModal: null,
  toast: null,
  theme: 'dark' as ThemePreference,

  viewState: {
    center: { lat: MAP_DEFAULTS.center[1], lng: MAP_DEFAULTS.center[0] },
    zoom: MAP_DEFAULTS.zoom,
    pitch: MAP_DEFAULTS.pitch,
    bearing: MAP_DEFAULTS.bearing,
  },
  layers: [] as MapLayer[],
  selectedVessel: null as AISVessel | null,
  hoveredVessel: null as AISVessel | null,
  activeLayers: ['sst', 'chlorophyll'] as OceanLayerId[],
  vesselFilter: [] as VesselTypeId[],
  timeRange: {
    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },
  isPlaying: false,
  playbackSpeed: 1,

  vessels: [] as AISVessel[],
  alerts: [] as MarineAlert[],
  lastUpdate: null as string | null,
  isLoading: false,
  error: null as string | null,

  conversations: [] as ChatConversation[],
  activeConversationId: null as string | null,
  isStreaming: false,

  user: null as User | null,
  isAuthenticated: false,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
        toggleCommandPalette: () =>
          set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
        toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
        setActiveModal: (modal) => set({ activeModal: modal }),
        showToast: (message, type = 'info') => set({ toast: { message, type } }),
        clearToast: () => set({ toast: null }),
        setTheme: (theme) => set({ theme }),

        setViewState: (viewState) =>
          set((state) => ({
            viewState: { ...state.viewState, ...viewState },
          })),
        setLayers: (layers) => set({ layers }),
        toggleLayer: (layerId) =>
          set((state) => ({
            layers: state.layers.map((layer) =>
              layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
            ),
          })),
        setLayerOpacity: (layerId, opacity) =>
          set((state) => ({
            layers: state.layers.map((layer) =>
              layer.id === layerId ? { ...layer, opacity } : layer
            ),
          })),
        setSelectedVessel: (vessel) => set({ selectedVessel: vessel }),
        setHoveredVessel: (vessel) => set({ hoveredVessel: vessel }),
        setActiveLayers: (layers) => set({ activeLayers: layers }),
        setVesselFilter: (types) => set({ vesselFilter: types }),
        setTimeRange: (range) => set({ timeRange: range }),
        setIsPlaying: (playing) => set({ isPlaying: playing }),
        setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

        setVessels: (vessels) => set({ vessels }),
        setAlerts: (alerts) => set({ alerts }),
        setLastUpdate: (timestamp) => set({ lastUpdate: timestamp }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),

        setConversations: (conversations) => set({ conversations }),
        addConversation: (conversation) =>
          set((state) => ({
            conversations: [conversation, ...state.conversations],
            activeConversationId: conversation.id,
          })),
        setActiveConversation: (id) => set({ activeConversationId: id }),
        updateConversation: (id, updates) =>
          set((state) => ({
            conversations: state.conversations.map((conv) =>
              conv.id === id ? { ...conv, ...updates } : conv
            ),
          })),
        setIsStreaming: (streaming) => set({ isStreaming: streaming }),

        setUser: (user) =>
          set((state) => ({
            user,
            isAuthenticated: !!user,
            // When a user is set, align the theme preference with theirs
            // (if they have one) so the setting survives sign-in.
            theme: user?.preferences?.theme ?? state.theme,
          })),
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
        updatePreferences: (preferences) =>
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  preferences: { ...state.user.preferences, ...preferences },
                }
              : null,
            theme: (preferences.theme as ThemePreference | undefined) ?? state.theme,
          })),
      }),
      {
        name: 'orca-app-store',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          rightPanelOpen: state.rightPanelOpen,
          activeLayers: state.activeLayers,
          vesselFilter: state.vesselFilter,
          timeRange: state.timeRange,
          playbackSpeed: state.playbackSpeed,
          theme: state.theme,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'ORCA Store' }
  )
);

export const useUI = () =>
  useAppStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    rightPanelOpen: state.rightPanelOpen,
    commandPaletteOpen: state.commandPaletteOpen,
    mobileNavOpen: state.mobileNavOpen,
    activeModal: state.activeModal,
    toast: state.toast,
    theme: state.theme,
    toggleSidebar: state.toggleSidebar,
    toggleRightPanel: state.toggleRightPanel,
    toggleCommandPalette: state.toggleCommandPalette,
    toggleMobileNav: state.toggleMobileNav,
    setActiveModal: state.setActiveModal,
    showToast: state.showToast,
    clearToast: state.clearToast,
    setTheme: state.setTheme,
  }));

export const useMap = () =>
  useAppStore((state) => ({
    viewState: state.viewState,
    layers: state.layers,
    selectedVessel: state.selectedVessel,
    hoveredVessel: state.hoveredVessel,
    activeLayers: state.activeLayers,
    vesselFilter: state.vesselFilter,
    timeRange: state.timeRange,
    isPlaying: state.isPlaying,
    playbackSpeed: state.playbackSpeed,
    setViewState: state.setViewState,
    setLayers: state.setLayers,
    toggleLayer: state.toggleLayer,
    setLayerOpacity: state.setLayerOpacity,
    setSelectedVessel: state.setSelectedVessel,
    setHoveredVessel: state.setHoveredVessel,
    setActiveLayers: state.setActiveLayers,
    setVesselFilter: state.setVesselFilter,
    setTimeRange: state.setTimeRange,
    setIsPlaying: state.setIsPlaying,
    setPlaybackSpeed: state.setPlaybackSpeed,
  }));

export const useData = () =>
  useAppStore((state) => ({
    vessels: state.vessels,
    alerts: state.alerts,
    lastUpdate: state.lastUpdate,
    isLoading: state.isLoading,
    error: state.error,
    setVessels: state.setVessels,
    setAlerts: state.setAlerts,
    setLastUpdate: state.setLastUpdate,
    setLoading: state.setLoading,
    setError: state.setError,
  }));

export const useChat = () =>
  useAppStore((state) => ({
    conversations: state.conversations,
    activeConversationId: state.activeConversationId,
    isStreaming: state.isStreaming,
    setConversations: state.setConversations,
    addConversation: state.addConversation,
    setActiveConversation: state.setActiveConversation,
    updateConversation: state.updateConversation,
    setIsStreaming: state.setIsStreaming,
  }));

export const useUser = () =>
  useAppStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    setUser: state.setUser,
    setAuthenticated: state.setAuthenticated,
    updatePreferences: state.updatePreferences,
  }));