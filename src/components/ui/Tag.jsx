import styles from "./Tag.module.css";

const iconMap = {
  "C++17": "devicon-cplusplus-plain",
  "C++ GameServer": "devicon-cplusplus-plain",
  "Spring Boot 3.5": "devicon-spring-original",
  "Java 21": "devicon-java-plain",
  "AWS SQS/S3": "devicon-amazonwebservices-plain-wordmark",
  "Redis": "devicon-redis-plain",
  "Docker": "devicon-docker-plain",
  "Docker Buildx": "devicon-docker-plain",
  "Unreal Engine 5 (C++)": "devicon-unrealengine-original",
  "Prometheus": "devicon-prometheus-original",
  "Grafana": "devicon-grafana-original",
  "GitLab CI/CD": "devicon-gitlab-plain",
  "CMake": "devicon-cmake-plain",
  "React Native": "devicon-react-original"
};

export default function Tag({ children, variant = "default" }) {
  const iconClass = typeof children === 'string' ? iconMap[children] : null;

  return (
    <span className={`${styles.tag} ${styles[variant]}`}>
      {iconClass && <i className={iconClass} style={{ marginRight: '6px', fontSize: '1.1em' }}></i>}
      {children}
    </span>
  );
}
