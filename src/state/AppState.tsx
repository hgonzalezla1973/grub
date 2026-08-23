import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  DietCategory,
  DISTANCE_FILTERS,
  distanceBucket,
  Restaurant,
  RESTAURANTS,
} from '../data/restaurants';
import { Coords, destinationPoint, haversineMiles, hashBearing } from '../utils/geo';
import { hasApiKey, searchVeganVegetarianNearby } from '../services/googlePlaces';

export type RestaurantsStatus = 'idle' | 'loading' | 'ready' | 'error' | 'no-api-key';

export type Screen = 'onboarding' | 'home' | 'results' | 'detail' | 'saved' | 'profile';
export type Mode = 'near' | 'trip';
export type Sort = 'distance' | 'rating';
export type ResultsView = 'list' | 'map';
export type Collection = 'all' | 'popular' | 'gems';
export type DistanceKey = 'any' | 'near' | 'mid' | 'far';

interface AppStateShape {
  screen: Screen;
  onboardStep: 1 | 2 | 3;
  mode: Mode;
  destination: string;
  diet: DietCategory[];
  mood: string;
  distance: DistanceKey;
  search: string;
  sort: Sort;
  resultsView: ResultsView;
  collection: Collection;
  filtersOpen: boolean;
  selectedId: string | null;
  peekId: string | null;
  favorites: string[];
  userLocation: Coords | null;
  apiRestaurants: Restaurant[] | null;
  restaurantsStatus: RestaurantsStatus;
}

const initialState: AppStateShape = {
  screen: 'onboarding',
  onboardStep: 1,
  mode: 'near',
  destination: '',
  diet: [],
  mood: 'any',
  distance: 'any',
  search: '',
  sort: 'distance',
  resultsView: 'list',
  collection: 'all',
  filtersOpen: false,
  selectedId: null,
  peekId: null,
  favorites: [],
  userLocation: null,
  apiRestaurants: null,
  restaurantsStatus: 'idle',
};

interface AppContextValue extends AppStateShape {
  goHome: () => void;
  goSaved: () => void;
  goProfile: () => void;
  goResults: () => void;
  startQuiz: () => void;
  onboardNext: () => void;
  setMode: (m: Mode) => void;
  setDestination: (v: string) => void;
  setSearch: (v: string) => void;
  setSort: (v: Sort) => void;
  setResultsView: (v: ResultsView) => void;
  setCollection: (c: Collection) => void;
  setPeek: (id: string | null) => void;
  openFilters: () => void;
  closeFilters: () => void;
  clearFilters: () => void;
  toggleDiet: (key: DietCategory) => void;
  setMood: (key: string) => void;
  setDistance: (key: DistanceKey) => void;
  toggleFavorite: (id: string) => void;
  openDetail: (id: string) => void;
  backToResults: () => void;
  setUserLocation: (loc: Coords | null) => void;
  hasLiveLocation: boolean;
  loadNearbyRestaurants: (loc: Coords) => void;
  usingSampleData: boolean;
  filteredRestaurants: Restaurant[];
  savedList: Restaurant[];
  selectedRestaurant: Restaurant | null;
  peekRestaurant: Restaurant | null;
  activeFilterCount: number;
  hasActiveFilters: boolean;
  filterSummary: string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppStateShape>(initialState);

  const patch = useCallback((p: Partial<AppStateShape>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const goHome = useCallback(() => patch({ screen: 'home' }), [patch]);
  const goSaved = useCallback(() => patch({ screen: 'saved' }), [patch]);
  const goProfile = useCallback(() => patch({ screen: 'profile' }), [patch]);
  const goResults = useCallback(() => patch({ screen: 'results', resultsView: 'list' }), [patch]);
  const startQuiz = useCallback(() => patch({ screen: 'results' }), [patch]);

  const onboardNext = useCallback(() => {
    setState((s) =>
      s.onboardStep >= 3 ? { ...s, screen: 'results' } : { ...s, onboardStep: (s.onboardStep + 1) as 1 | 2 | 3 }
    );
  }, []);

  const setMode = useCallback((m: Mode) => patch({ mode: m }), [patch]);
  const setDestination = useCallback((v: string) => patch({ destination: v }), [patch]);
  const setSearch = useCallback((v: string) => patch({ search: v }), [patch]);
  const setSort = useCallback((v: Sort) => patch({ sort: v }), [patch]);
  const setResultsView = useCallback((v: ResultsView) => patch({ resultsView: v }), [patch]);
  const setCollection = useCallback((c: Collection) => patch({ collection: c, peekId: null }), [patch]);
  const setPeek = useCallback((id: string | null) => patch({ peekId: id }), [patch]);
  const openFilters = useCallback(() => patch({ filtersOpen: true }), [patch]);
  const closeFilters = useCallback(() => patch({ filtersOpen: false }), [patch]);
  const clearFilters = useCallback(() => patch({ diet: [], mood: 'any', distance: 'any' }), [patch]);

  const toggleDiet = useCallback((key: DietCategory) => {
    setState((s) => ({
      ...s,
      diet: s.diet.includes(key) ? s.diet.filter((k) => k !== key) : [...s.diet, key],
    }));
  }, []);

  const setMood = useCallback((key: string) => patch({ mood: key }), [patch]);
  const setDistance = useCallback((key: DistanceKey) => patch({ distance: key }), [patch]);

  const toggleFavorite = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    }));
  }, []);

  const openDetail = useCallback((id: string) => patch({ screen: 'detail', selectedId: id }), [patch]);
  const backToResults = useCallback(() => patch({ screen: 'results' }), [patch]);
  const setUserLocation = useCallback((loc: Coords | null) => patch({ userLocation: loc }), [patch]);

  const loadNearbyRestaurants = useCallback((loc: Coords) => {
    if (!hasApiKey()) {
      patch({ restaurantsStatus: 'no-api-key' });
      return;
    }
    patch({ restaurantsStatus: 'loading' });
    searchVeganVegetarianNearby(loc)
      .then((results) => setState((s) => ({ ...s, apiRestaurants: results, restaurantsStatus: 'ready' })))
      .catch((e) => {
        console.warn('[places] nearby search failed', e);
        setState((s) => ({ ...s, restaurantsStatus: 'error' }));
      });
  }, [patch]);

  /**
   * Real Google Places results take priority once loaded. Until then (or if no API key is
   * configured, or the request failed), fall back to the fictional sample dataset: since
   * those restaurant addresses aren't real, there's nothing to geocode, so each one is
   * anchored at its designed sample distance along a stable per-id bearing once the user's
   * real coordinates are known, purely so distance sort/filter and map placement have
   * *something* real-geo-shaped to work from in the demo-data case.
   */
  const liveRestaurants = useMemo(() => {
    if (state.apiRestaurants) return state.apiRestaurants;
    const loc = state.userLocation;
    if (!loc) return RESTAURANTS;
    return RESTAURANTS.map((r) => {
      const bearing = hashBearing(r.id);
      const coords = destinationPoint(loc, r.distance, bearing);
      const liveDistance = Math.round(haversineMiles(loc, coords) * 10) / 10;
      return { ...r, distance: liveDistance, lat: coords.lat, lng: coords.lng };
    });
  }, [state.apiRestaurants, state.userLocation]);

  const filteredRestaurants = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    const list = liveRestaurants.filter((r) => {
      if (state.diet.length && !state.diet.includes(r.dietCategory)) return false;
      if (state.mood !== 'any' && r.cuisine !== state.mood) return false;
      if (state.distance !== 'any' && distanceBucket(r.distance) !== state.distance) return false;
      if (q && !r.name.toLowerCase().includes(q) && !r.cuisine.toLowerCase().includes(q) && !r.address.toLowerCase().includes(q))
        return false;
      if (state.resultsView === 'map' && state.collection === 'popular' && r.reviewCount < 150) return false;
      if (state.resultsView === 'map' && state.collection === 'gems' && !(r.rating >= 4.7 && r.reviewCount < 200))
        return false;
      return true;
    });
    list.sort((a, b) => (state.sort === 'rating' ? b.rating - a.rating : a.distance - b.distance));
    return list;
  }, [liveRestaurants, state.search, state.diet, state.mood, state.distance, state.resultsView, state.collection, state.sort]);

  const savedList = useMemo(
    () => liveRestaurants.filter((r) => state.favorites.includes(r.id)),
    [liveRestaurants, state.favorites]
  );

  const selectedRestaurant = useMemo(
    () => (state.selectedId ? liveRestaurants.find((r) => r.id === state.selectedId) ?? null : null),
    [liveRestaurants, state.selectedId]
  );

  const peekRestaurant = useMemo(
    () => (state.peekId ? liveRestaurants.find((r) => r.id === state.peekId) ?? null : null),
    [liveRestaurants, state.peekId]
  );

  const activeFilterCount =
    state.diet.length + (state.mood !== 'any' ? 1 : 0) + (state.distance !== 'any' ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const filterSummary = useMemo(() => {
    const parts: string[] = [...state.diet.map((k) => k)];
    if (state.mood !== 'any') parts.push(state.mood);
    if (state.distance !== 'any') {
      const found = DISTANCE_FILTERS.find((d) => d[0] === state.distance);
      if (found) parts.push(found[1]);
    }
    return parts.join(' · ') || 'All nearby spots';
  }, [state.diet, state.mood, state.distance]);

  const value: AppContextValue = {
    ...state,
    goHome,
    goSaved,
    goProfile,
    goResults,
    startQuiz,
    onboardNext,
    setMode,
    setDestination,
    setSearch,
    setSort,
    setResultsView,
    setCollection,
    setPeek,
    openFilters,
    closeFilters,
    clearFilters,
    toggleDiet,
    setMood,
    setDistance,
    toggleFavorite,
    openDetail,
    backToResults,
    setUserLocation,
    hasLiveLocation: state.userLocation !== null,
    loadNearbyRestaurants,
    usingSampleData: state.apiRestaurants === null,
    filteredRestaurants,
    savedList,
    selectedRestaurant,
    peekRestaurant,
    activeFilterCount,
    hasActiveFilters,
    filterSummary,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
