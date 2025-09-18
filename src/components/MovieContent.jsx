import React from "react";
import HeroSection from "./HeroSection";
import MovieSlider from "./MovieSlider";
import GenreSection from "./GenreSection";
import MoviesDetails from "./MoviesDetails";
import Footer from "./Footer";
import { useMovies } from "../context/MoviesContext";

function MovieContent() {
  const {
    trendingMovies,
    popularMovies,
    topRatedMovies,
    selectedMovieId,
    closeMovieDetails,
    error,
  } = useMovies();

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-neutral-900
      text-white"
      >
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="yellow"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star-icon lucide-star"
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
          <h2 className="text-2xl font-bold mt-4">Error Loading Movies</h2>
          <p className="mt-2 text-neutral-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-950">
        <MovieSlider
          title="Trending This Week"
          subtitle="Stay Updated With what Everyone's watching"
          movies={trendingMovies}
          id="trending"
        />
        <MovieSlider
          title="Popular Movies"
          subtitle="Most watched movies right now"
          movies={popularMovies}
          id="popular"
        />
        <GenreSection />

        <MovieSlider
          title="Top Rated Movies"
          subtitle="Highest rated movies of all time"
          movies={topRatedMovies}
          id="top-rated"
        />
      </div>
      {/* conditional rendering */}
      {selectedMovieId && (
        <MoviesDetails movieId={selectedMovieId} onClose={closeMovieDetails} />
      )}
    </>
  );
}

export default MovieContent;
