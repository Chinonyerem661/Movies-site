import React, { useEffect, useState } from "react";
import { useMovies } from "../context/MoviesContext";
import { fetchMoviesByGenre, getImageURl } from "../services/api";

function GenreSection() {
  const { genres, loading, openMoviesDetails } = useMovies();
  const [selectedGenre, setSelectedGenre] = useState(null);
  // use local component state, not context hook, to store movies
  const [genreMovies, setGenreMovies] = useState([]);
  // this should be a boolean flag
  const [loadingGenreMovies, setLoadingGenreMovies] = useState(false);

  useEffect(() => {
    if (!loading && genres.length > 0) {
      setSelectedGenre(genres[0]);
    }
  }, [loading, genres]);

  useEffect(() => {
    const loadGenreMovies = async () => {
      if (!selectedGenre) return;
      setLoadingGenreMovies(true);
      const movies = await fetchMoviesByGenre(selectedGenre.id);
      setGenreMovies(movies.slice(0, 8));
      setLoadingGenreMovies(false);
    };
    loadGenreMovies();
  }, [selectedGenre]);

  if (loading || !selectedGenre) {
    return (
      <section className="py-12 bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div
                className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const formatRating = (rating) => {
    return (Math.round(rating * 10) / 10).toFixed(1);
  };

  return (
    <section className="py-12 bg-neutral-700">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Browse by Genre
        </h2>

        {/* Genre tabs  */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {/* conditional rendering */}
            {genres.slice(0, 10).map((gen) => {
              return (
                <button
                  className={`px-4 py-4 rounded-md transition-colors text-sm ${
                    selectedGenre?.id === gen.id
                      ? "bg-purple-600 text-white"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                  onClick={() => setSelectedGenre(gen)}
                >
                  {gen.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conditional rendering */}
        {loadingGenreMovies ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div
                className="w-12 h-12 border-4 border-purple-500 border-t-transparent
                rounded-full animate-spin"
              ></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* map method */}
            {genreMovies.map((movie) => {
              return (
                <div
                  className="group cursor-pointer"
                  onClick={() => openMoviesDetails(movie.id)}
                >
                  <div className="relative rounded-lg overflow-hidden bg-neutral-800">
                    <div className="aspect-[2/3]">
                      <img
                        src={getImageURl(movie.poster_path, "w500")}
                        alt={movie.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:opacity-35"
                      />
                      <div
                    className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-star"
                            >
                              <path d="M12 17.75 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span className="text-yellow-400 text-sm font-medium">
                              {formatRating(movie.vote_average)}
                            </span>
                          </div>
                          <span className="text-neutral-400 text-sm">
                            {movie.release_date?.substring(0, 4) || "N/A"}
                          </span>
                        </div>

                        <button
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white
                  py-2 rounded-md flex items-center justify-center gap-1 transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-star"
                          >
                            <path d="M12 17.75 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-white text-sm font-medium truncate">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-star"
                        >
                          <path d="M12 17.75 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className="text-red-400 text-xs">
                          {formatRating(movie.vote_average)}
                        </span>
                      </div>
                      <span className="text-red-500 text-xs">
                        {movie.release_date?.substring(0, 4) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* else */}
      </div>
    </section>
  );
}
export default GenreSection;
