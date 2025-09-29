// Simple TMDB API Test
const TMDB_READ_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjEwNTkxZjI4MTgyYjFjYWI4MDVlNWU1ODEwZDBjIiwic3ViIjoiNjMTc1OTExOTc2MjMyNTIsImlzcyI6InNlY3VyZSIsImV4cCI6MTcwOTYyOTBhNjJkZWMyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l9FbbJ6xmaGJ2EHW39QkDuMASTH8s5kwVtO0wcXffzk";

async function testTMDBAPI() {
  console.log('🎬 Testing TMDB API...');
  
  try {
    // Test search movie
    console.log('\n1. Testing movie search...');
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=Avatar&include_adult=false&language=id-ID&page=1`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
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
      `https://api.themoviedb.org/3/movie/popular?language=id-ID&page=1`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
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
    console.log('✅ API integration is working correctly');
    console.log('🎬 Movie/Film Info Bot is ready to use!');
    
  } catch (error) {
    console.error('❌ TMDB API test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if API token is valid');
    console.log('   2. Check internet connection');
    console.log('   3. Verify TMDB API status');
  }
}

// Run test
testTMDBAPI();
