import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "favourite_noodles";

const useFavourites = () => {
  const [favourites, setFavourites] = useState<string[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data: any) => {
      if (data) setFavourites(JSON.parse(data));
    });
  }, []);

  // Save to local storage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = (id: string) => {
    setFavourites((prev) => Array.from(new Set([...prev, id])));
  };

  const removeFavourite = (id: string) => {
    setFavourites((prev) => prev.filter((item) => item !== id));
  };

  const isFavourite = (id: string) => favourites.includes(id);

  return { favourites, addFavourite, removeFavourite, isFavourite };
};

export default useFavourites;
