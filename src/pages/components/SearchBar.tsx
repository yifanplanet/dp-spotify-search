import { useCallback, useEffect, useState } from "react";
import History from "./History";
import { debounce } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearch = useCallback(debounce(onSearch, 300), []);

  return (
    <>
      <div>
        <input
          type="text"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Search for a track"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      {isFocused && <History />}
    </>
  );
};

export default SearchBar;
