import grasplink from "./grasplink";
import robotpal from "./robotpal";
import mausoleum from "./mausoleum";
import autowingcar from "./autowingcar";

export const featuredProjects = [grasplink, robotpal, mausoleum, autowingcar].map((project, index) => ({
  ...project,
  featured: true,
  number: String(index + 1).padStart(2, "0"),
}));

export const getProject = (id) => featuredProjects.find((project) => project.id === id) ?? null;
