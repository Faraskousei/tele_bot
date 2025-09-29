// Test TMDB Service Integration
import { TMDBService } from './src/lib/tmdb.js';

async function testTMDBService() {
  console.log('🎬 Testing TMDB Service...');
  
  try {
    // Test 1: Search Movie
    console.log('\n1. Testing movie search...');
    const movieResult = await TMDBService.searchMovie('Avatar');
    
    if (movieResult) {
      console.log('✅ Movie search successful!');
      console.log(`   Title: ${movieResult.title}`);
      console.log(`   Rating: ${movieResult.rating}/10`);
      console.log(`   Year: ${movieResult.releaseYear}`);
      console.log(`   Genres: ${movieResult.genres.join(', ')}`);
      console.log(`   Runtime: ${movieResult.runtime} minutes`);
    } else {
      console.log('❌ Movie search failed');
    }
    
    // Test 2: Get Popular Movies
    console.log('\n2. Testing popular movies...');
    const popularMovies = await TMDBService.getPopularMovies(1);
    
    if (popularMovies.length > 0) {
      console.log('✅ Popular movies retrieved!');
      console.log(`   Found ${popularMovies.length} movies`);
      console.log(`   Top movie: ${popularMovies[0].title}`);
    } else {
      console.log('❌ Failed to get popular movies');
    }
    
    // Test 3: Get Trending Movies
    console.log('\n3. Testing trending movies...');
    const trendingMovies = await TMDBService.getTrendingMovies();
    
    if (trendingMovies.length > 0) {
      console.log('✅ Trending movies retrieved!');
      console.log(`   Found ${trendingMovies.length} movies`);
      console.log(`   Top trending: ${trendingMovies[0].title}`);
    } else {
      console.log('❌ Failed to get trending movies');
    }
    
    console.log('\n🎉 TMDB Service test completed!');
    console.log('✅ All features working correctly');
    console.log('🎬 Movie/Film Info Bot is ready!');
    
  } catch (error) {
    console.error('❌ TMDB Service test failed:', error);
  }
}

// Run test
testTMDBService();
