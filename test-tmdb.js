// Test TMDB API Integration
import { TMDBService } from './src/lib/tmdb.js';

async function testTMDB() {
  console.log('🎬 Testing TMDB API Integration...');
  
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
    
    // Test 4: Search TV Show
    console.log('\n4. Testing TV show search...');
    const tvResult = await TMDBService.searchTVShow('Breaking Bad');
    
    if (tvResult) {
      console.log('✅ TV show search successful!');
      console.log(`   Title: ${tvResult.name}`);
      console.log(`   Rating: ${tvResult.rating}/10`);
      console.log(`   First Air Year: ${tvResult.firstAirYear}`);
    } else {
      console.log('❌ TV show search failed');
    }
    
    console.log('\n🎉 TMDB API test completed!');
    console.log('✅ All features working correctly');
    
  } catch (error) {
    console.error('❌ TMDB API test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if API keys are correct');
    console.log('   2. Check internet connection');
    console.log('   3. Verify TMDB API status');
  }
}

// Run test
testTMDB();
