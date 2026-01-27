const jobService = require('../services/jobService');
const mockData = require('../mockData.json');
const { isValidJobQuery } = require('../utils/inputValidation');

exports.search = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!isValidJobQuery(query)) {
    return res.status(400).json({ error: `"${query}" is not a valid job title.` });
  }

  try {
    const job = await jobService.searchJob(query);

    if (!job) {
      return res.status(400).json({ error: `"${query}" does not appear to be a valid job role.` });
    }

    res.json([job]);
  } catch (error) {
    console.error('Error in search controller:', error);
    res.status(500).json({ error: 'Failed to process request.' });
  }
};

exports.getAll = (req, res) => {
  res.json(mockData);
};
