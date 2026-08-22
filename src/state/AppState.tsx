import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  DietCategory,
  DISTANCE_FILTERS,
  distanceBucket,
  Restaurant,
  RESTAURANTS,
} from '../data/restaurants';

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

  const filteredRestaurants = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    const list = RESTAURANTS.filter((r) => {
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
  }, [state.search, state.diet, state.mood, state.distance, state.resultsView, state.collection, state.sort]);

  const savedList = useMemo(
    () => RESTAURANTS.filter((r) => state.favorites.includes(r.id)),
    [state.favorites]
  );

  const selectedRestaurant = useMemo(
    () => (state.selectedId ? RESTAURANTS.find((r) => r.id === state.selectedId) ?? null : null),
    [state.selectedId]
  );

  const peekRestaurant = useMemo(
    () => (state.peekId ? RESTAURANTS.find((r) => r.id === state.peekId) ?? null : null),
    [state.peekId]
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
