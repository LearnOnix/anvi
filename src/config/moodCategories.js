// Browse / Explore Categories
// type:
// - home
// - mood
// - language
// - genre
// - era
// - artist
// - special

export const MUSIC_CATEGORIES = [
  // ==========================
  // HOME
  // ==========================
  { id: "trending", type: "home", label: "Trending", query: "trending indian songs" },
  { id: "topcharts", type: "home", label: "Top Charts", query: "top indian songs" },
  { id: "new", type: "home", label: "New Releases", query: "new hindi songs" },
  { id: "viral", type: "home", label: "Viral Hits", query: "viral songs india" },

  // ==========================
  // MOODS
  // ==========================
  { id: "romantic", type: "mood", label: "Romantic", query: "romantic hindi songs" },
  { id: "love", type: "mood", label: "Love Songs", query: "love songs" },
  { id: "sad", type: "mood", label: "Sad", query: "sad hindi songs" },
  { id: "heartbreak", type: "mood", label: "Heartbreak", query: "heartbreak songs" },
  { id: "lofi", type: "mood", label: "Lofi", query: "lofi songs" },
  { id: "chill", type: "mood", label: "Chill", query: "chill songs" },
  { id: "acoustic", type: "mood", label: "Acoustic", query: "acoustic songs" },
  { id: "party", type: "mood", label: "Party", query: "party songs hindi" },
  { id: "dance", type: "mood", label: "Dance", query: "dance hits" },
  { id: "workout", type: "mood", label: "Workout", query: "workout songs" },
  { id: "roadtrip", type: "mood", label: "Road Trip", query: "road trip songs" },
  { id: "focus", type: "mood", label: "Focus", query: "focus instrumental music" },
  { id: "sleep", type: "mood", label: "Sleep", query: "sleep relaxing music" },

  // ==========================
  // LANGUAGES
  // ==========================
  { id: "hindi", type: "language", label: "Hindi", query: "hindi songs" },
  { id: "punjabi", type: "language", label: "Punjabi", query: "punjabi songs" },
  { id: "english", type: "language", label: "English", query: "english songs" },
  { id: "telugu", type: "language", label: "Telugu", query: "telugu songs" },
  { id: "tamil", type: "language", label: "Tamil", query: "tamil songs" },
  { id: "malayalam", type: "language", label: "Malayalam", query: "malayalam songs" },
  { id: "kannada", type: "language", label: "Kannada", query: "kannada songs" },
  { id: "marathi", type: "language", label: "Marathi", query: "marathi songs" },
  { id: "bengali", type: "language", label: "Bengali", query: "bengali songs" },
  { id: "gujarati", type: "language", label: "Gujarati", query: "gujarati songs" },

  // ==========================
  // GENRES
  // ==========================
  { id: "bollywood", type: "genre", label: "Bollywood", query: "bollywood songs" },
  { id: "indie", type: "genre", label: "Indie", query: "indie india songs" },
  { id: "pop", type: "genre", label: "Pop", query: "pop songs" },
  { id: "hiphop", type: "genre", label: "Hip-Hop", query: "indian hip hop" },
  { id: "rap", type: "genre", label: "Rap", query: "hindi rap songs" },
  { id: "edm", type: "genre", label: "EDM", query: "edm hits" },
  { id: "rock", type: "genre", label: "Rock", query: "rock songs" },
  { id: "folk", type: "genre", label: "Folk", query: "folk songs india" },
  { id: "ghazal", type: "genre", label: "Ghazal", query: "ghazal" },
  { id: "qawwali", type: "genre", label: "Qawwali", query: "qawwali" },
  { id: "devotional", type: "genre", label: "Devotional", query: "bhakti songs" },

  // ==========================
  // ERAS
  // ==========================
  { id: "90s", type: "era", label: "90's Hits", query: "90s hindi songs" },
  { id: "2000s", type: "era", label: "2000's Hits", query: "2000s bollywood songs" },
  { id: "2010s", type: "era", label: "2010's Hits", query: "2010 bollywood hits" },
  { id: "evergreen", type: "era", label: "Evergreen", query: "evergreen hindi songs" },

  // ==========================
  // TOP ARTISTS
  // ==========================
  { id: "arijit", type: "artist", label: "Arijit Singh", query: "Arijit Singh" },
  { id: "shreya", type: "artist", label: "Shreya Ghoshal", query: "Shreya Ghoshal" },
  { id: "jubin", type: "artist", label: "Jubin Nautiyal", query: "Jubin Nautiyal" },
  { id: "armaan", type: "artist", label: "Armaan Malik", query: "Armaan Malik" },
  { id: "atif", type: "artist", label: "Atif Aslam", query: "Atif Aslam" },
  { id: "kk", type: "artist", label: "KK", query: "KK" },
  { id: "sonu", type: "artist", label: "Sonu Nigam", query: "Sonu Nigam" },
  { id: "rahat", type: "artist", label: "Rahat Fateh Ali Khan", query: "Rahat Fateh Ali Khan" },
  { id: "pritam", type: "artist", label: "Pritam", query: "Pritam" },
  { id: "rahman", type: "artist", label: "A. R. Rahman", query: "A R Rahman" },
  { id: "vishal", type: "artist", label: "Vishal Mishra", query: "Vishal Mishra" },
  { id: "badshah", type: "artist", label: "Badshah", query: "Badshah" },
  { id: "honey", type: "artist", label: "Yo Yo Honey Singh", query: "Yo Yo Honey Singh" },
  { id: "diljit", type: "artist", label: "Diljit Dosanjh", query: "Diljit Dosanjh" },
  { id: "karan", type: "artist", label: "Karan Aujla", query: "Karan Aujla" },
  { id: "shubh", type: "artist", label: "Shubh", query: "Shubh" },
  { id: "sidhu", type: "artist", label: "Sidhu Moose Wala", query: "Sidhu Moose Wala" },
  { id: "anirudh", type: "artist", label: "Anirudh Ravichander", query: "Anirudh Ravichander" },
  { id: "anuv", type: "artist", label: "Anuv Jain", query: "Anuv Jain" },

  // ==========================
  // SPECIAL
  // ==========================
  { id: "reels", type: "special", label: "Instagram Reels", query: "instagram trending songs" },
  { id: "shorts", type: "special", label: "YouTube Shorts", query: "youtube shorts songs" },
  { id: "wedding", type: "special", label: "Wedding", query: "wedding songs" },
  { id: "garba", type: "special", label: "Garba", query: "garba songs" },
  { id: "holi", type: "special", label: "Holi", query: "holi songs" },
  { id: "diwali", type: "special", label: "Diwali", query: "diwali songs" },
];