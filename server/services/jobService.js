const Job = require('../models/Job');
const JobAlias = require('../models/JobAlias');
const geminiService = require('./geminiService');

exports.searchJob = async (query) => {
  const normalizedQuery = query.toLowerCase();

  // 1. Unified Lookup: Check JobAlias
  const alias = await JobAlias.findOne({
    where: { query: normalizedQuery },
    include: Job
  });

  if (alias && alias.Job) {
    console.log(`Cache HIT (Alias) for: ${query} -> ${alias.Job.title}`);
    return alias.Job;
  }

  console.log(`Cache MISS for: ${query}. Calling AI...`);

  // 2. Ask Gemini
  const aiData = await geminiService.analyzeJob(query);
  const canonicalTitle = aiData.canonicalTitle;
  const normalizedCanonical = canonicalTitle.toLowerCase();

  // Ensure aliases is an array and includes the canonical title and user query
  const aliases = Array.isArray(aiData.aliases) ? aiData.aliases : [];
  const allAliases = new Set([
    normalizedCanonical,
    normalizedQuery,
    ...aliases.map(a => a.toLowerCase())
  ]);

  // 3. Write Strategy
  let job;

  // Check if Job exists for canonical title
  const existingAlias = await JobAlias.findOne({
    where: { query: normalizedCanonical },
    include: Job
  });

  if (existingAlias && existingAlias.Job) {
    console.log(`Found existing Job for canonical: ${canonicalTitle}`);
    job = existingAlias.Job;
  } else {
    console.log(`Creating NEW Job: ${canonicalTitle}`);
    job = await Job.create({
      title: canonicalTitle,
      field: aiData.field,
      automationScore: aiData.automationScore,
      predictions: aiData.predictions,
      humanEdge: aiData.humanEdge
    });
  }

  // Bulk Create Aliases
  console.log(`Saving aliases: ${[...allAliases].join(', ')}`);
  const aliasPromises = [...allAliases].map(aliasQuery =>
    JobAlias.findOrCreate({
      where: { query: aliasQuery },
      defaults: { JobId: job.id }
    })
  );

  await Promise.all(aliasPromises);

  return job;
};
