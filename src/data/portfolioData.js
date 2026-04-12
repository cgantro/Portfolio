import { metaData } from "./metaData";
import { techStacks } from "./techStackData";
import { featuredProjectDecks, inProgressDeck } from "./projectsData";
import { collaborationContact } from "./collaborationData";

export const portfolioDocument = {
  ...metaData,
  techStacks,
  featuredProjectDecks,
  inProgressDeck,
  collaborationContact,
};
