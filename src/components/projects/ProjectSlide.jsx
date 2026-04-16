import TechIcon from "../common/TechIcon";
import SlideCard from "../common/SlideCard";
import FigureBlock from "../common/FigureBlock";
import MetricCard from "../common/MetricCard";

const STACK_ICON_KEY = {
  "Spring Boot": "springboot",
  MQTT: "mqtt",
  STOMP: "websocket",
  Redis: "redis",
  PostgreSQL: "postgres",
  Docker: "docker",
  "GitLab CI": "gitlab",
  "C++17": "cplusplus",
  OpenGL: "opengl",
  libjpeg: "image",
  TCP: "network",
  벤치마킹: "chart",
  "Unreal Engine 5": "unreal",
  "C++": "cplusplus",
  "전용 서버": "server",
  WebSocket: "websocket",
  UDP: "udp",
};

function StackBlock({ block }) {
  return (
    <SlideCard title={block.title} className="tech-stack-card">
      <div className="project-stack-tags in-slide">
        {block.items.map((tag) => (
          <span key={tag} className="project-tag">
            <TechIcon iconKey={STACK_ICON_KEY[tag]} label={tag} />
            {tag}
          </span>
        ))}
      </div>
    </SlideCard>
  );
}

function LeftBlock({ block }) {
  return (
    <SlideCard title={block.title} className={block.featured ? "is-featured" : ""}>
      <ul>
        {block.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </SlideCard>
  );
}

function RightBlock({ block }) {
  if (block.type === "figure") {
    return <FigureBlock title={block.title} caption={block.caption} bullets={block.bullets} image={block.image} />;
  }

  if (block.type === "metrics") {
    return <MetricCard title={block.title} items={block.items} />;
  }

  if (block.type === "stack") {
    return <StackBlock block={block} />;
  }

  return (
    <SlideCard title={block.title}>
      <ul>
        {block.items?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </SlideCard>
  );
}

export default function ProjectSlide({ slide, projectName, isActive }) {
  const classes = ["project-slide", isActive ? "is-active" : ""].filter(Boolean).join(" ");
  const rightBlocks = slide.rightBlocks || [];
  const layoutClasses = ["project-slide-layout", rightBlocks.length === 0 ? "is-single-column" : ""].filter(Boolean).join(" ");

  return (
    <article className={classes} data-slide-key={slide.key} aria-hidden={isActive ? "false" : "true"}>
      <header className="project-slide-header">
        <p>{slide.label}</p>
        <h4>{slide.title}</h4>
        {slide.summary ? <span>{slide.summary}</span> : null}
      </header>

      <header className="project-slide-header print-only">
        <p className="project-slide-project-name">{projectName}</p>
        <h4>{slide.label}</h4>
      </header>

      <div className={layoutClasses}>
        <div className="project-slide-left">
          {slide.leftBlocks.map((block) => (
            <LeftBlock key={block.title} block={block} />
          ))}
        </div>

        {rightBlocks.length > 0 ? (
          <div className="project-slide-right">
            {rightBlocks.map((block) => (
              <RightBlock key={block.title} block={block} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
