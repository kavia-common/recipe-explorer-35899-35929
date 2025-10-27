import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

/**
 * RecipesContext manages:
 * - recipes: full list loaded from an API (mock integration point)
 * - filtered: derived list based on current filters and query
 * - filters: { query, tags, cuisine, difficulty }
 * - favorites: array of recipe ids
 * - collections: array of { id, name, recipeIds: [] }
 *
 * Actions:
 * - loadRecipes: load from recipesApi and place into state
 * - search: update query (alias to setFilters with query)
 * - setFilters: update any subset of filters
 * - toggleFavorite: add/remove recipe id from favorites
 * - addToCollection: add a recipe id to a named or existing collection
 * - removeFromCollection: remove a recipe id from a collection by id
 *
 * Note: Replace "recipesApi" placeholder with a real API module when backend exists.
 */

// Filter types and defaults
const DEFAULT_FILTERS = {
  query: '',
  tags: [],        // array of strings
  cuisine: '',     // string
  difficulty: '',  // string (e.g., 'easy' | 'medium' | 'hard')
};

// Initial state
const initialState = {
  recipes: [],
  filtered: [],
  filters: DEFAULT_FILTERS,
  favorites: [],
  collections: [], // [{ id, name, recipeIds: [] }]
  loading: false,
  error: null,
};

// Action types
const TYPES = {
  START: 'START',
  LOAD_SUCCESS: 'LOAD_SUCCESS',
  LOAD_ERROR: 'LOAD_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  ADD_TO_COLLECTION: 'ADD_TO_COLLECTION',
  REMOVE_FROM_COLLECTION: 'REMOVE_FROM_COLLECTION',
};

// Small helper used to generate ids for collections when not provided
function genId(prefix = 'col_') {
  return prefix + Math.random().toString(36).slice(2, 10);
}

// Apply current filters to recipes list
function applyFilters(recipes, filters) {
  const { query, tags, cuisine, difficulty } = filters || DEFAULT_FILTERS;
  const q = (query || '').trim().toLowerCase();
  const wantTags = (tags || []).map((t) => t.toLowerCase()).filter(Boolean);
  const wantCuisine = (cuisine || '').toLowerCase();
  const wantDifficulty = (difficulty || '').toLowerCase();

  return (recipes || []).filter((r) => {
    const name = (r?.name || r?.title || '').toLowerCase();
    const desc = (r?.description || '').toLowerCase();
    const textMatch = q
      ? name.includes(q) || desc.includes(q)
      : true;

    const tagList = (r?.tags || []).map((t) => (t || '').toLowerCase());
    const tagsMatch =
      wantTags.length > 0 ? wantTags.every((t) => tagList.includes(t)) : true;

    const cuisineMatch = wantCuisine ? (r?.cuisine || '').toLowerCase() === wantCuisine : true;
    const difficultyMatch = wantDifficulty ? (r?.difficulty || '').toLowerCase() === wantDifficulty : true;

    return textMatch && tagsMatch && cuisineMatch && difficultyMatch;
  });
}

// Reducer to manage state transitions
function reducer(state, action) {
  switch (action.type) {
    case TYPES.START: {
      return { ...state, loading: true, error: null };
    }
    case TYPES.LOAD_SUCCESS: {
      const recipes = Array.isArray(action.payload) ? action.payload : [];
      const filtered = applyFilters(recipes, state.filters);
      return { ...state, loading: false, recipes, filtered, error: null };
    }
    case TYPES.LOAD_ERROR: {
      return { ...state, loading: false, error: action.error || 'Failed to load recipes' };
    }
    case TYPES.SET_FILTERS: {
      const nextFilters = { ...state.filters, ...action.payload };
      const filtered = applyFilters(state.recipes, nextFilters);
      return { ...state, filters: nextFilters, filtered };
    }
    case TYPES.TOGGLE_FAVORITE: {
      const id = action.payload;
      const exists = state.favorites.includes(id);
      const favorites = exists
        ? state.favorites.filter((fid) => fid !== id)
        : [...state.favorites, id];
      return { ...state, favorites };
    }
    case TYPES.ADD_TO_COLLECTION: {
      const { collectionId, collectionName, recipeId } = action.payload || {};
      let nextCollections = [...state.collections];

      // Resolve or create collection target
      let targetIndex = -1;
      if (collectionId) {
        targetIndex = nextCollections.findIndex((c) => c.id === collectionId);
      } else if (collectionName) {
        targetIndex = nextCollections.findIndex(
          (c) => c.name.toLowerCase() === collectionName.toLowerCase()
        );
      }

      if (targetIndex === -1) {
        // Create new collection
        const newCollection = {
          id: genId(),
          name: collectionName || 'New Collection',
          recipeIds: recipeId ? [recipeId] : [],
        };
        nextCollections.push(newCollection);
      } else {
        const col = nextCollections[targetIndex];
        const has = col.recipeIds.includes(recipeId);
        if (!has && recipeId) {
          const updated = { ...col, recipeIds: [...col.recipeIds, recipeId] };
          nextCollections[targetIndex] = updated;
        }
      }

      return { ...state, collections: nextCollections };
    }
    case TYPES.REMOVE_FROM_COLLECTION: {
      const { collectionId, recipeId } = action.payload || {};
      const nextCollections = state.collections.map((c) => {
        if (c.id !== collectionId) return c;
        return { ...c, recipeIds: c.recipeIds.filter((rid) => rid !== recipeId) };
      });
      return { ...state, collections: nextCollections };
    }
    default:
      return state;
  }
}

/**
 * Placeholder API for loading recipes.
 * Replace with real implementation (e.g., fetch from backend) when available.
 */
async function recipesApiList() {
  // Mock some data to demonstrate filtering and interactions
  // In a real app, use: await fetch('/api/recipes').then(r => r.json())
  await new Promise((r) => setTimeout(r, 150));
  return [
    {
      id: 'r1',
      name: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta with eggs, cheese, pancetta, and pepper.',
      tags: ['italian', 'pasta', 'quick'],
      cuisine: 'Italian',
      difficulty: 'Easy',
    },
    {
      id: 'r2',
      name: 'Chicken Tikka Masala',
      description: 'Creamy spiced curry with grilled chicken pieces.',
      tags: ['indian', 'curry'],
      cuisine: 'Indian',
      difficulty: 'Medium',
    },
    {
      id: 'r3',
      name: 'Avocado Toast Deluxe',
      description: 'Sourdough toast with smashed avocado, radish, and chili flakes.',
      tags: ['breakfast', 'quick', 'vegetarian'],
      cuisine: 'American',
      difficulty: 'Easy',
    },
  ];
}

// PUBLIC_INTERFACE
export const RecipesContext = createContext({
  /**
   * All loaded recipes from API
   */
  recipes: [],
  /**
   * Recipes filtered by current filters
   */
  filtered: [],
  /**
   * Current filter state
   */
  filters: DEFAULT_FILTERS,
  /**
   * Favorite recipe ids
   */
  favorites: [],
  /**
   * Collections: array of { id, name, recipeIds: [] }
   */
  collections: [],
  /**
   * Whether recipes are loading
   */
  loading: false,
  /**
   * Last error during load if any
   */
  error: null,

  // Actions
  loadRecipes: async () => {},
  search: (_query) => {},
  setFilters: (_partial) => {},
  toggleFavorite: (_recipeId) => {},
  addToCollection: (_options) => {},
  removeFromCollection: (_options) => {},
});

// PUBLIC_INTERFACE
export function RecipesProvider({ children }) {
  /**
   * Provides recipes data and actions to the app.
   * Integrates a placeholder recipesApi for now.
   * On mount, it automatically loads recipes.
   */
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadRecipes = useCallback(async () => {
    dispatch({ type: TYPES.START });
    try {
      const data = await recipesApiList();
      dispatch({ type: TYPES.LOAD_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: TYPES.LOAD_ERROR, error: err?.message || String(err) });
    }
  }, []);

  const setFilters = useCallback((partial) => {
    dispatch({ type: TYPES.SET_FILTERS, payload: partial || {} });
  }, []);

  const search = useCallback((query) => {
    dispatch({ type: TYPES.SET_FILTERS, payload: { query: query ?? '' } });
  }, []);

  const toggleFavorite = useCallback((recipeId) => {
    if (!recipeId) return;
    dispatch({ type: TYPES.TOGGLE_FAVORITE, payload: recipeId });
  }, []);

  const addToCollection = useCallback(({ collectionId, collectionName, recipeId }) => {
    if (!recipeId && !collectionName && !collectionId) return;
    dispatch({
      type: TYPES.ADD_TO_COLLECTION,
      payload: { collectionId, collectionName, recipeId },
    });
  }, []);

  const removeFromCollection = useCallback(({ collectionId, recipeId }) => {
    if (!collectionId || !recipeId) return;
    dispatch({ type: TYPES.REMOVE_FROM_COLLECTION, payload: { collectionId, recipeId } });
  }, []);

  // Auto-load on mount
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const value = useMemo(
    () => ({
      ...state,
      loadRecipes,
      search,
      setFilters,
      toggleFavorite,
      addToCollection,
      removeFromCollection,
    }),
    [state, loadRecipes, search, setFilters, toggleFavorite, addToCollection, removeFromCollection]
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useRecipes() {
  /**
   * Hook to access RecipesContext
   */
  return useContext(RecipesContext);
}
