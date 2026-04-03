import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSavedProblems, saveProblem, deleteProblem } from '../services/storage';

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedProblems().then((items) => {
      setSavedItems(items);
      setLoading(false);
    });
  }, []);

  async function addSaved(item) {
    const updated = await saveProblem(item);
    setSavedItems(updated);
  }

  async function removeSaved(id) {
    const updated = await deleteProblem(id);
    setSavedItems(updated);
  }

  return (
    <SavedContext.Provider value={{ savedItems, loading, addSaved, removeSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  return useContext(SavedContext);
}
