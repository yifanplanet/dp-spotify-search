import { useCallback, useEffect, useState } from "react";
import History from "./History";
import { debounce } from "@/lib/utils";
import { Track } from "@/lib/types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchResults: Track[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchResults }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const debouncedSearch = useCallback(debounce(onSearch, 300), []);

  useEffect(() => {
    if (isFocused) {
      setShowHistory(true);
    }
  }, [isFocused]);

  return (
    <>
      <div
        className={`search-container ${
          searchResults?.length ? "show-search-results" : ""
        }`}
      >
        <input
          type="text"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder={isFocused ? "" : "Search for a track"}
          className={`input ${
            !!searchResults?.length
              ? "show-search-results"
              : showHistory
              ? "show-history"
              : ""
          }`}
        />
        {!searchResults?.length && showHistory && <History />}
      </div>
    </>
  );
};

export default SearchBar;
