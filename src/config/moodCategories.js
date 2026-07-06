// Har entry Moods tab pe ek horizontal row banata hai. `query` wahi text
// hai jo backend search me jata hai — API me genre-filter nahi hai, isliye
// search-term hi category ka kaam karta hai.
export const MOOD_CATEGORIES = [
  { id: 'romantic', label: 'Romantic', query: 'romantic hindi love songs' },
  { id: 'sad', label: 'Sad & Heartbreak', query: 'sad hindi songs heartbreak' },
  { id: 'emotional', label: 'Emotional', query: 'emotional hindi songs' },
  { id: 'lofi', label: 'Lofi Chill', query: 'lofi hindi songs chill' },
  { id: 'soft', label: 'Soft & Acoustic', query: 'soft acoustic hindi songs' },
]

export const TOP_SINGERS = [
  { id: 'arijit', label: 'Arijit Singh', query: 'Arijit Singh' },
  { id: 'neha', label: 'Neha Kakkar', query: 'Neha Kakkar' },
  { id: 'jubin', label: 'Jubin Nautiyal', query: 'Jubin Nautiyal' },
  { id: 'shreya', label: 'Shreya Ghoshal', query: 'Shreya Ghoshal' },
]