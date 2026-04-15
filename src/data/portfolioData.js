import { metaData } from "./metaData";
import { techStacks } from "./techStackData";
import { featuredProjectDecks } from "./projectsData";
import { collaborationContact } from "./collaborationData";

export const portfolioDocument = {
  ...metaData,
  techStacks,
  featuredProjectDecks,
  collaborationContact,
};
