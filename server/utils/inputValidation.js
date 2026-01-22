const INVALID_QUERIES = [
  'hello', 'hi', 'hey', 'greetings',
  'bye', 'goodbye', 'cya',
  'test', 'testing',
  'thanks', 'thank you',
  'what is', 'who is',
  'help', 'support'
];

exports.isValidJobQuery = (query) => {
  if (!query || typeof query !== 'string') return false;

  const normalizedQuery = query.trim().toLowerCase();

  // Check minimum length
  if (normalizedQuery.length < 2) return false;

  // Check blocklist
  if (INVALID_QUERIES.includes(normalizedQuery)) return false;

  return true;
};
