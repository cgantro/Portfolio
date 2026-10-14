import { careerData } from './index';

const claims = careerData.projects.flatMap((project) => [...project.contributions, ...project.outcomes, ...project.metrics]);
const unverified = claims.filter((claim) => claim.status === 'unverified').length;
console.log(`Career data valid: ${careerData.projects.length} projects, ${careerData.editions.length} editions, ${claims.length} evidence-linked claims (${unverified} unverified).`);
console.log('Reported measurements remain reported; validation checks structure and references, not scientific reproducibility.');
