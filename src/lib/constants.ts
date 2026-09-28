/**
 * ORCA Marine Intelligence Platform
 * Global constants and configuration.
 */

export const APP_NAME = 'ORCA';
export const APP_FULL_NAME = 'ORCA — Marine Intelligence Platform';
export const APP_DESCRIPTION =
  'ORCA combines satellite data, AIS, oceanographic observations, weather information, and AI agents into actionable marine intelligence.';

// Navigation structure
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Intelligence', href: '/intelligence' },
  { label: 'Live Map', href: '/map' },
  { label: 'AI Assistant', href: '/assistant' },
  { label: 'Vessels', href: '/vessels' },
  { label: 'Ocean', href: '/ocean' },
  { label: 'Simulations', href: '/simulations' },
  { label: '3D Explorer', href: '/explorer' },
  { label: 'Learning', href: '/learning' },
  { label: 'Games', href: '/games' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/about' },
];

export const FOOTER_NAV = {
  Platform: [
    { label: 'Home', href: '/' },
    { label: 'Live Map', href: '/map' },
    { label: 'AI Assistant', href: '/assistant' },
    { label: 'Simulations', href: '/simulations' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Data Sources', href: '/data-sources' },
    { label: 'API Reference', href: '/api' },
    { label: 'Research', href: '/research' },
  ],
  Community: [
    { label: 'Community', href: '/community' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Contact', href: '/contact' },
    { label: 'Contribute', href: '/contribute' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};

// Marine data constants
export const OCEAN_LAYERS = [
  { id: 'sst', label: 'Sea Surface Temperature', unit: '°C', color: '#ef4444' },
  { id: 'chlorophyll', label: 'Chlorophyll-a', unit: 'mg/m³', color: '#22c55e' },
  { id: 'waveHeight', label: 'Wave Height', unit: 'm', color: '#3b82f6' },
  { id: 'windSpeed', label: 'Wind Speed', unit: 'm/s', color: '#a855f7' },
  { id: 'currents', label: 'Ocean Currents', unit: 'm/s', color: '#06b6d4' },
  { id: 'bathymetry', label: 'Bathymetry', unit: 'm', color: '#1e3a8a' },
  { id: 'salinity', label: 'Salinity', unit: 'PSU', color: '#f59e0b' },
  { id: 'dissolvedOxygen', label: 'Dissolved Oxygen', unit: 'mg/L', color: '#14b8a6' },
] as const;

export type OceanLayerId = (typeof OCEAN_LAYERS)[number]['id'];

// Vessel types
export const VESSEL_TYPES = [
  { id: 'cargo', label: 'Cargo', icon: 'Ship', color: '#3b82f6' },
  { id: 'tanker', label: 'Tanker', icon: 'Droplets', color: '#f59e0b' },
  { id: 'fishing', label: 'Fishing', icon: 'Fish', color: '#22c55e' },
  { id: 'passenger', label: 'Passenger', icon: 'Users', color: '#8b5cf6' },
  { id: 'research', label: 'Research', icon: 'Microscope', color: '#06b6d4' },
  { id: 'tug', label: 'Tug', icon: 'Anchor', color: '#64748b' },
  { id: 'pleasure', label: 'Pleasure', icon: 'Sailboat', color: '#ec4899' },
  { id: 'military', label: 'Military', icon: 'Shield', color: '#475569' },
  { id: 'unknown', label: 'Unknown', icon: 'HelpCircle', color: '#94a3b8' },
] as const;

export type VesselTypeId = (typeof VESSEL_TYPES)[number]['id'];

// AI Agent definitions
export const AI_AGENTS = [
  { id: 'satellite', name: 'Satellite Agent', description: 'Processes Earth observation imagery and derived products.' },
  { id: 'ocean-state', name: 'Ocean State Agent', description: 'Analyzes SST, chlorophyll, waves, currents, and salinity.' },
  { id: 'ais', name: 'AIS Agent', description: 'Tracks vessel movements and identifies patterns.' },
  { id: 'weather', name: 'Weather Agent', description: 'Integrates atmospheric and marine weather forecasts.' },
  { id: 'fishing-zone', name: 'Fishing Zone Agent', description: 'Predicts Potential Fishing Zones using multi-source data.' },
  { id: 'risk', name: 'Risk Agent', description: 'Evaluates collision, storm, and pollution risks.' },
  { id: 'safety', name: 'Safety Agent', description: 'Monitors safety alerts and emergency beacons.' },
  { id: 'route', name: 'Route Agent', description: 'Optimizes vessel routes for fuel, weather, and safety.' },
  { id: 'recommendation', name: 'Recommendation Agent', description: 'Synthesizes insights into actionable recommendations.' },
  { id: 'conversational', name: 'Conversational Agent', description: 'Natural language interface to the ORCA platform.' },
] as const;

export type AgentId = (typeof AI_AGENTS)[number]['id'];

// Simulation scenarios
export const SIMULATION_SCENARIOS = [
  { id: 'storm', label: 'Storm Simulation', description: 'Model storm tracks and impacts on marine operations.' },
  { id: 'route', label: 'Vessel Route Optimization', description: 'Find optimal routes considering weather and currents.' },
  { id: 'current', label: 'Ocean Current Simulation', description: 'Visualize and predict ocean current dynamics.' },
  { id: 'fishing', label: 'Fishing Zone Prediction', description: 'Simulate PFZ formation and persistence.' },
  { id: 'collision', label: 'Collision Risk Assessment', description: 'Evaluate near-miss and collision probabilities.' },
  { id: 'fuel', label: 'Fuel Efficiency Analysis', description: 'Optimize speed and route for fuel savings.' },
  { id: 'pollution', label: 'Marine Pollution Tracking', description: 'Simulate spill dispersion and response.' },
  { id: 'sar', label: 'Search & Rescue', description: 'Model drift and optimize search patterns.' },
  { id: 'weather', label: 'Weather Route Optimization', description: 'Avoid adverse weather while minimizing cost.' },
] as const;

export type SimulationScenarioId = (typeof SIMULATION_SCENARIOS)[number]['id'];

// Learning / Gamification
export const ACHIEVEMENTS = [
  { id: 'ocean-explorer', label: 'Ocean Explorer', description: 'Explore 10 different ocean regions.', xp: 100 },
  { id: 'satellite-scout', label: 'Satellite Scout', description: 'Analyze 5 satellite images.', xp: 150 },
  { id: 'ais-navigator', label: 'AIS Navigator', description: 'Track 20 unique vessels.', xp: 200 },
  { id: 'storm-analyst', label: 'Storm Analyst', description: 'Complete 3 storm simulations.', xp: 250 },
  { id: 'pfz-hunter', label: 'PFZ Hunter', description: 'Identify 5 potential fishing zones.', xp: 300 },
  { id: 'deep-sea-researcher', label: 'Deep Sea Researcher', description: 'Explore bathymetry data.', xp: 350 },
  { id: 'orca-operator', label: 'ORCA Operator', description: 'Reach Level 10.', xp: 500 },
] as const;

export const GAME_MODES = [
  { id: 'catch-the-front', label: 'Catch the Front', description: 'Identify ocean fronts from SST data.', icon: 'Waves' },
  { id: 'route-the-vessel', label: 'Route the Vessel', description: 'Navigate a vessel safely to port.', icon: 'Navigation' },
  { id: 'spot-the-pfz', label: 'Spot the PFZ', description: 'Find potential fishing zones.', icon: 'Fish' },
  { id: 'save-the-fleet', label: 'Save the Fleet', description: 'Protect vessels from a storm.', icon: 'Shield' },
  { id: 'mission-ocean', label: 'Mission Ocean', description: 'Complete a multi-stage ocean mission.', icon: 'Target' },
] as const;

// Quality settings
export const QUALITY_PRESETS = {
  LOW: {
    dpr: 1,
    shadows: false,
    particles: 500,
    waveDetail: 32,
    postprocessing: false,
    antialias: false,
  },
  MEDIUM: {
    dpr: 1.5,
    shadows: true,
    particles: 2000,
    waveDetail: 64,
    postprocessing: true,
    antialias: true,
  },
  HIGH: {
    dpr: 2,
    shadows: true,
    particles: 5000,
    waveDetail: 128,
    postprocessing: true,
    antialias: true,
  },
} as const;

export type QualityLevel = keyof typeof QUALITY_PRESETS;

// Map defaults
export const MAP_DEFAULTS = {
  center: [85.0, 15.0] as [number, number], // Bay of Bengal region
  zoom: 5,
  minZoom: 1,
  maxZoom: 18,
  pitch: 0,
  bearing: 0,
};

// API endpoints (for reference; actual calls via services)
export const API_ENDPOINTS = {
  AIS: '/api/ais',
  OCEAN: '/api/ocean',
  WEATHER: '/api/weather',
  SATELLITE: '/api/satellite',
  MAP: '/api/map',
  SIMULATION: '/api/simulation',
  AI: '/api/ai',
  AUTH: '/api/auth',
} as const;

// Feature flags (development)
export const FEATURE_FLAGS = {
  enable3D: true,
  enableMap: true,
  enableAI: true,
  enableSimulations: true,
  enableGames: true,
  enableCommunity: true,
} as const;