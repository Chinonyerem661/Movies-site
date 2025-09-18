import React, { useEffect, useState, useRef } from "react";
import { useMovies } from "../context/MoviesContext";
import { getImageURl, searchMovies } from "../services/api";

function Navbar() {
  const {openMoviesDetails} = useMovies();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResult, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length > 2){
        setIsSearching(true)
        try{
          const result = await searchMovies(searchQuery);
          setSearchResult(result ? result.slice(0, 5) : []);
        }catch(error){
          console.error("Error Searching Movies:", error);
        }finally{
          setIsSearching(false);
          setShowSearchResults(true);
        }
      } else {
        setSearchResult([]);
        setShowSearchResults(false);
      }
    };
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    }
  }, [searchQuery]);

  const handleSearchFocus = () => {
    if(searchQuery.trim().length > 2 && searchResult.length > 0){
      setShowSearchResults(true);
    }
  }

  const handleClickOutside = (e) => {
    if(searchContainerRef.current && !searchContainerRef.current.contains(e.target)
    ) {
      setShowSearchResults(false);
    }
  };

  const handleMovieSelect = (movieId) => {
    openMoviesDetails(movieId);
    setShowSearchResults(false)
    setSearchQuery("")
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-neutral-900/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-purple-500 font-bold text-3xl">
                Cine<span className="text-white">Mix</span>
              </span>
            </a>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-white hover:text-purple-400 transition-all font-medium"
            >
              Home
            </a>
            <a
              href="#trending"
              className="text-white hover:text-purple-400 transition-all font-medium"
            >
              Trending
            </a>
            <a
              href="#popular"
              className="text-white hover:text-purple-400 transition-all font-medium"
            >
              Popular
            </a>
            <a
              href="#top-rated"
              className="text-white hover:text-purple-400 transition-all font-medium"
            >
              Top Rated
            </a>
          </nav>

          {/* Desktop search */}
          <div
            className="hidden md:block relative search-container"
            ref={searchContainerRef}
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder="Search movies....."
                className="bg-neutral-800/80 text-white px-4 py-2 rounded-full text-sm w-48
                focus:w-64 transition-all duration-300 focus:outline-none focus:ring-2
                focus:ring-purple-500/50"
              />

              {/* Conditional rendering */}
              {isSearching ? (
                <div className="absolute right-3 top-2.5">
                  <svg
                   className="w-4 h-4 text-neutral-400 lucide lucide-search-icon lucide-search"
                   xmlns="http://www.w3.org/2000/svg"
                   width="24"
                   height="24"
                   viewBox="0 0 24 24"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="2"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 >
                    <path d="m21 21-4.34-4.34" />
                    <circle cx="11" cy="11" r="8" />
                  </svg>
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute right-3 top-3 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 0 11-14 0 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </div>

            {/* Search result dropdown cond. rendering */}
            {showSearchResult && searchResult && searchResult.length > 0 && (
              <div
                className="absolute mt-2 w-71 bg-neutral-800 rounded-lg shadow-lg
            overflow-hidden z-50"
              >
                <ul className="divide-y divide-neutral-700">
                  {searchResult.map((movie) => {
                    return (
                      <li className="hover:bg-neutral-700">
                    <button className="flex items-center p-3 w-full text-left" onClick=
                    {() => handleMovieSelect(movie.id)}>
                      <div
                        className="w-10 h-10 bg-neutral-700 rounded overflow-hidden
                            flex-shrink-0"
                      >
                        {/* Conditional rendering */}
                        {movie.poster_path ? (
                           <img
                          src={getImageURl(movie.poster_path, "w92")}
                          alt=""
                          className="w-full h-full object-cover"
                        />) : <div
                          className="w-full h-full flex items-center justify-center
                                text-neutral-500 text-xs"
                        >
                          {" "}
                          No Image
                        </div>}
                       
                        {/* Else */}
                        
                      </div>

                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {movie.title}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {movie.release_date?.split("-")[0] || "N/A"}
                        </p>
                      </div>
                    </button>
                  </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Conditional rendering */}
            {showSearchResult &&
              searchQuery.trim().length > 2 &&
              (!searchResult || searchResult.length === 0) &&
              !isSearching && (
                <div
                  className="absolute mt-2 w-72 bg-neutral-800 rounded-lg shadow-lg
            overflow-hidden z-50"
                >
                  <div className="p-4 text-center text-neutral-400 text-sm">
                    No movies found matching.....
                  </div>
                </div>
              )}
          </div>

          {/* Mobile menu dutton */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {/* Conditional rendering  */}
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu-icon lucide-menu"
              >
                <path d="M4 12h16" />
                <path d="M4 18h16" />
                <path d="M4 6h16" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu-icon lucide-menu"
              >
                <path d="M4 12h16" />
                <path d="M4 18h16" />
                <path d="M4 6h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav cond. rendering */}
        {isMobileMenuOpen && (
          <div className="mt-4 pb-4 space-y-4 md:hidden">
            <a
              href="#"
              className="block text-white hover:text-purple-400 transition-all font-medium"
            >
              Home
            </a>
            <a
              href="#trending"
              className="block text-white hover:text-purple-400 transition-all font-medium"
            >
              Trending
            </a>
            <a
              href="#popular"
              className="block text-white hover:text-purple-400 transition-all font-medium"
            >
              Popular
            </a>
            <a
              href="#top-rated"
              className="block text-white hover:text-purple-400 transition-all font-medium"
            >
              Top Rated
            </a>
            <div className="relative mt-3 search-container" ref={searchContainerRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e)=> setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder="Search movies....."
                className="bg-neutral-800/80 text-white px-4 py-2 rounded-full text-sm w-48
                focus:w-64 transition-all duration-300 focus:outline-none focus:ring-2
                focus:ring-purple-500/50"
              />

              {/* Conditional rendering */}
              {isSearching ? (
                <div className="absolute right-3 top-2.5">
                  <svg
                    
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-search-icon lucide-search"
                  >
                    <path d="m21 21-4.34-4.34" />
                    <circle cx="11" cy="11" r="8" />
                  </svg>
                  {/* Else */}
                  <svg
                    className="w-4 h-4 absolute right-3 text-neutral-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21l-6-6m2-5a7 0 11-14 0 7 7 0 0 0114 0z"
                    />
                  </svg>
                </div>
              ) : (
                <svg
                  className="w-4 h-4 absolute right-3 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21l-6-6m2-5a7 0 11-14 0 7 7 0 0 0114 0z"
                  />
                </svg>
              )}

              {/* mobile search result conditional. rendering */}
              {showSearchResult && searchResult && searchResult.length > 0 && (
                <div
                  className="absolute mt-2 w-full bg-neutral-800 rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <ul className="divide-y divide-neutral-700">
                    {/* Map method */}
                    {searchResult.map((movie) => {
                      return (
                        <li className="hover:bg-neutral-700">
                      <button className="flex items-center p-3 wfull text-left">
                        <div
                          className="w-10 h-10 bg-neutral-700 rounded-full overflow-hidden
                                flex-shrink-0"
                        >
                          {/* Conditional rendering */}
                          <img
                            src={getImageURl(movie.poster_path, "w92")}
                            alt=""
                            className="w-full h-full objcet-cover"
                          />
                          {/* Else */}
                          <div
                            className="w-full h-full flex items-center justify-center
                                    text-neutral-500 text-xs"
                          >
                            No Image
                          </div>
                        </div>

                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {movie.title}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {movie.release_date?.split("-")[0] || "N/A"}
                          </p>
                        </div>
                      </button>
                    </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/*Conditional rendering */}
              {showSearchResult &&
                searchQuery.trim().length > 2 &&
                (!searchResult || searchResult.length === 0) &&
                !isSearching && (
                  <div
                    className="absolute mt-2 w-full bg-neutral-800 rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-4 text-center text-neutral-400 text-sm">
                      No Movies found matching.....
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
