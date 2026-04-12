const ICON_URL_MAP = {
  springboot: "https://cdn.simpleicons.org/springboot/6DB33F",
  redis: "https://cdn.simpleicons.org/redis/DC382D",
  postgres: "https://cdn.simpleicons.org/postgresql/4169E1",
  docker: "https://cdn.simpleicons.org/docker/2496ED",
  nginx: "https://cdn.simpleicons.org/nginx/009639",
  gitlab: "https://cdn.simpleicons.org/gitlab/FC6D26",
  mqtt: "https://cdn.simpleicons.org/mqtt/660066",
  socket: "https://cdn.simpleicons.org/socketdotio/010101",
  websocket: "https://cdn.simpleicons.org/socketdotio/010101",
  java: "https://cdn.simpleicons.org/openjdk/EA2D2E",
  cplusplus: "https://cdn.simpleicons.org/cplusplus/00599C",
  jira: "https://cdn.simpleicons.org/jira/0052CC",
  git: "https://cdn.simpleicons.org/git/F05032",
  notion: "https://cdn.simpleicons.org/notion/111111",
  unreal: "https://cdn.simpleicons.org/unrealengine/0E1128",
  aop: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/gear.svg",
  logging: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/file-earmark-text.svg",
  scrum: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/kanban.svg",
  udp: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/diagram-3.svg",
};

function getFallbackText(label = "") {
  const cleaned = label.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return cleaned.slice(0, 2) || "IC";
}

export default function TechIcon({ iconKey, label }) {
  const src = ICON_URL_MAP[iconKey];

  if (!src) {
    return <span className="stack-icon stack-icon-fallback">{getFallbackText(label)}</span>;
  }

  return (
    <span className="stack-icon" aria-label={label} title={label}>
      <img
        className="stack-icon-img"
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(event) => {
          const target = event.currentTarget;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.classList.add("stack-icon-fallback");
            parent.textContent = getFallbackText(label);
          }
        }}
      />
    </span>
  );
}
