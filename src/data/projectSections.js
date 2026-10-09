const SECTION_DEFINITIONS = {
  results: { label: "주요 성과", title: "주요 성과" },
  architecture: { label: "시스템 구조", title: "시스템 아키텍처" },
  implementation: { label: "주요 구현", title: "주요 구현 기능" },
  "case-studies": { label: "문제 해결", title: "문제 해결 사례" },
  verification: { label: "검증", title: "성능 검증 및 한계" },
  sources: { label: "자료", title: "소스 코드 및 시연" },
};

export function getProjectSections(project) {
  return (project.sectionOrder ?? Object.keys(SECTION_DEFINITIONS))
    .filter((id) => {
      if (id === "results") return Boolean(project.metrics?.length || project.resultSummary);
      if (id === "architecture") return Boolean(project.architecture?.summary || project.architecture?.image || project.architecture?.flow?.length);
      if (id === "implementation") return Boolean(project.implementations?.length);
      if (id === "case-studies") return Boolean(project.caseStudies?.length);
      if (id === "verification") return Boolean(project.verification?.items?.length || project.verification?.summary);
      if (id === "sources") return Boolean(project.links?.github || project.links?.demo);
      return false;
    })
    .map((id) => ({ id, ...SECTION_DEFINITIONS[id] }));
}
