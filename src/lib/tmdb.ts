import { API_KEYS } from '@/config/bot';

interface MovieInfo {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  rating: number;
  releaseYear: string | number;
  genres: string[];
  runtime: string | number;
  originalLanguage: string;
  posterPath: string | null;
}

interface TVShowInfo {
  id: number;
  name: string;
  originalName: string;
  overview: string;
  rating: number;
  firstAirYear: string | number;
  genres: string[];
  originalLanguage: string;
  posterPath: string | null;
}

export class TMDBService {
  private static readonly BASE_URL = 'https://api.themoviedb.org/3';
  private static readonly API_KEY = API_KEYS.TMDB;

  private static async makeRequest(endpoint: string) {
    try {
      // Add API key to endpoint
      const separator = endpoint.includes('?') ? '&' : '?';
      const url = `${this.BASE_URL}${endpoint}${separator}api_key=${this.API_KEY}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TMDB API request failed:', error);
      throw error;
    }
  }

  // Search Movies
  static async searchMovie(query: string): Promise<MovieInfo | null> {
    try {
      const data = await this.makeRequest(
        `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=id-ID&page=1`
      );

      if (data.results && data.results.length > 0) {
        const movie = data.results[0];
        
        // Get detailed movie info
        const movieDetail = await this.makeRequest(`/movie/${movie.id}?language=id-ID`);
        
        return {
          id: movie.id,
          title: movie.title,
          originalTitle: movie.original_title,
          overview: movie.overview || 'Sinopsis tidak tersedia',
          rating: movie.vote_average,
          releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Tidak diketahui',
          genres: movieDetail.genres ? movieDetail.genres.map((g: any) => g.name) : [],
          runtime: movieDetail.runtime || 'Tidak diketahui',
          originalLanguage: movie.original_language.toUpperCase(),
          posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error searching movie:', error);
      return null;
    }
  }

  // Search TV Shows
  static async searchTVShow(query: string): Promise<TVShowInfo | null> {
    try {
      const data = await this.makeRequest(
        `/search/tv?query=${encodeURIComponent(query)}&include_adult=false&language=id-ID&page=1`
      );

      if (data.results && data.results.length > 0) {
        const tv = data.results[0];
        
        // Get detailed TV show info
        const tvDetail = await this.makeRequest(`/tv/${tv.id}?language=id-ID`);
        
        return {
          id: tv.id,
          name: tv.name,
          originalName: tv.original_name,
          overview: tv.overview || 'Sinopsis tidak tersedia',
          rating: tv.vote_average,
          firstAirYear: tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'Tidak diketahui',
          genres: tvDetail.genres ? tvDetail.genres.map((g: any) => g.name) : [],
          originalLanguage: tv.original_language.toUpperCase(),
          posterPath: tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : null
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error searching TV show:', error);
      return null;
    }
  }

  // Get Popular Movies
  static async getPopularMovies(page: number = 1) {
    try {
      const data = await this.makeRequest(`/movie/popular?language=id-ID&page=${page}`);
      return data.results || [];
    } catch (error) {
      console.error('Error getting popular movies:', error);
      return [];
    }
  }

  // Get Popular TV Shows
  static async getPopularTVShows(page: number = 1) {
    try {
      const data = await this.makeRequest(`/tv/popular?language=id-ID&page=${page}`);
      return data.results || [];
    } catch (error) {
      console.error('Error getting popular TV shows:', error);
      return [];
    }
  }

  // Get Trending Movies
  static async getTrendingMovies() {
    try {
      const data = await this.makeRequest('/trending/movie/week?language=id-ID');
      return data.results || [];
    } catch (error) {
      console.error('Error getting trending movies:', error);
      return [];
    }
  }

  // Get Trending TV Shows
  static async getTrendingTVShows() {
    try {
      const data = await this.makeRequest('/trending/tv/week?language=id-ID');
      return data.results || [];
    } catch (error) {
      console.error('Error getting trending TV shows:', error);
      return [];
    }
  }

  // Get Movie Genres
  static async getMovieGenres() {
    try {
      const data = await this.makeRequest('/genre/movie/list?language=id-ID');
      return data.genres || [];
    } catch (error) {
      console.error('Error getting movie genres:', error);
      return [];
    }
  }

  // Get TV Genres
  static async getTVGenres() {
    try {
      const data = await this.makeRequest('/genre/tv/list?language=id-ID');
      return data.genres || [];
    } catch (error) {
      console.error('Error getting TV genres:', error);
      return [];
    }
  }
}
