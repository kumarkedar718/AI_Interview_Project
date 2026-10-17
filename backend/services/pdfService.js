const pdf = require('pdf-parse');

async function extractTextFromPDFBuffer(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF Parsing error:', error);
    throw new Error('Could not parse PDF file buffer');
  }
}

function extractKeyTopics(text) {
  if (!text) return [];
  const commonTech = [
    'React', 'React.js', 'Vue', 'Angular', 'Next.js', 'JavaScript', 'TypeScript', 'Node.js',
    'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C++', 'C#', '.NET',
    'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind', 'Bootstrap', 'Sass',
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQL', 'Redis', 'Firebase', 'Supabase',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'GitHub',
    'REST API', 'GraphQL', 'Microservices', 'System Design', 'Agile', 'Scrum'
  ];

  const found = new Set();

  commonTech.forEach(tech => {
    try {
      // Properly escape special characters like +, #, . for regex
      const escapedTech = tech.replace(/([.*+?^${}()|[\]\\])/g, '\\$1');
      const regex = new RegExp(`(?:^|\\b|\\s)${escapedTech}(?:$|\\b|\\s)`, 'i');
      if (regex.test(text)) {
        found.add(tech);
      }
    } catch (e) {
      console.warn('Regex error for tech:', tech, e);
    }
  });

  return Array.from(found);
}

module.exports = {
  extractTextFromPDFBuffer,
  extractKeyTopics
};
