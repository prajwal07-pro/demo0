/**
 * ORCA pages barrel.
 *
 * Pages are lazily imported in App.tsx, but this barrel exposes the
 * component references for consumers that need type-level access (for
 * example, a route manifest or a documentation tool).
 */

export { default as Home } from './Home';
export { default as LiveMap } from './LiveMap';
export { default as AIAssistant } from './AIAssistant';
export { default as Intelligence } from './Intelligence';
export { default as Vessels } from './Vessels';
export { default as Ocean } from './Ocean';
export { default as Simulations } from './Simulations';
export { default as Explorer } from './Explorer';
export { default as Learning } from './Learning';
export { default as Games } from './Games';
export { default as Community } from './Community';
export { default as Alerts } from './Alerts';
export { default as About } from './About';
export { default as Profile } from './Profile';
export { default as Settings } from './Settings';
export { default as NotFound } from './NotFound';