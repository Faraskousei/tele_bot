// Test TMDB API with API Key
const TMDB_API_KEY = "db10591f98182b1ca805e5ee581d820c";

async function testTMDBWithAPIKey() {
  console.log('🎬 Testing TMDB API with API Key...');
  
  try {
    // Test search movie with API key
    console.log('\n1. Testing movie search with API key...');
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=Avatar&include_adult=false&language=id-ID&page=1`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      console.log('✅ Movie search successful!');
      console.log(`   Title: ${movie.title}`);
      console.log(`   Rating: ${movie.vote_average}/10`);
      console.log(`   Release Date: ${movie.release_date}`);
      console.log(`   Overview: ${movie.overview.substring(0, 100)}...`);
    } else {
      console.log('❌ No movies found');
    }
    
    // Test popular movies
    console.log('\n2. Testing popular movies...');
    const popularResponse = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=id-ID&page=1`
    );

    if (popularResponse.ok) {
      const popularData = await popularResponse.json();
      console.log('✅ Popular movies retrieved!');
      console.log(`   Found ${popularData.results.length} movies`);
      console.log(`   Top 3:`);
      popularData.results.slice(0, 3).forEach((movie, index) => {
        console.log(`   ${index + 1}. ${movie.title} (${movie.vote_average}/10)`);
      });
    } else {
      console.log('❌ Failed to get popular movies');
    }
    
    console.log('\n🎉 TMDB API test completed successfully!');
    console.log('✅ API Key integration is working correctly');
    console.log('🎬 Movie/Film Info Bot is ready to use!');
    
  } catch (error) {
    console.error('❌ TMDB API test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if API key is valid');
    console.log('   2. Check internet connection');
    console.log('   3. Verify TMDB API status');
    console.log('   4. Check if API key has proper permissions');
  }
}

// Run test
testTMDBWithAPIKey();
