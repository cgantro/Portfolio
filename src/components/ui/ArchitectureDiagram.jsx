import styles from "./ArchitectureDiagram.module.css";

const ARCH_IMAGES = {
  sticker:   "/스티커_아키텍처.png",
  robotpal:  "/로봇팔_아키텍처.png",
  mausoleum: "/영묘_아키텍처.png",
};

export default function ArchitectureDiagram({ projectId }) {
  const src = ARCH_IMAGES[projectId];
  if (!src) {
    return (
      <div className={styles.placeholder}>아키텍처 다이어그램이 준비되지 않았습니다.</div>
    );
  }
  return (
    <div className={styles.imageWrap}>
      <img
        src={src}
        alt={`${projectId} 아키텍처 다이어그램`}
        className={styles.archImage}
      />
    </div>
  );
}

function StickerArch() {
  return (
    <div className={styles.container}>
      <div className={styles.mainArch}>
        
        {/* CI/CD & Client Column */}
        <div className={styles.colGroup}>
          <div className={`${styles.serverGroup} ${styles.themeDocker}`}>
            <div className={styles.serverTitle}>
              <i className="devicon-gitlab-plain"></i>
              <span>GitLab CI/CD</span>
            </div>
            <div className={styles.nodeBoxWrapper}>
              <div className={styles.nodeSm}><span>Push (mr_build/deploy)</span></div>
              <div className={styles.edgeDown}></div>
              <div className={styles.nodeSm}><span>Docker Buildx (Multi-arch)</span></div>
              <div className={styles.edgeDown}></div>
              <div className={styles.nodeSm}><i className="devicon-docker-plain"></i><span>Docker Hub</span></div>
              <div className={styles.edgeDown}><span>SSH Deploy</span></div>
              <div className={styles.nodeSm}><i className="devicon-amazonwebservices-plain-wordmark"></i><span>AWS EC2</span></div>
            </div>
          </div>
          
          <div className={styles.nodeBox} style={{ borderColor: '#61dafb' }}>
            <i className="devicon-react-original" style={{ color: '#61dafb' }}></i>
            <span>React Native (Expo)</span>
            <span className={styles.subText}>Mobile Client</span>
          </div>
        </div>

        <div className={styles.edgeRight}><span>HTTPS</span></div>

        {/* Gateway */}
        <div className={styles.colGroup}>
          <div className={styles.nodeBox} style={{ borderColor: '#24A1C1' }}>
            <i className="devicon-docker-plain" style={{ color: '#24A1C1' }}></i>
            <span>Traefik Gateway</span>
            <span className={styles.subText}>Host-based Routing</span>
          </div>
          <div className={styles.edgeDown}></div>
          <div className={styles.nodeSm}><span>Prometheus + Grafana</span></div>
        </div>
        
        <div className={styles.edgeRight}><span>Proxy</span></div>

        {/* AWS Backend */}
        <div className={`${styles.serverGroup} ${styles.themeAws}`}>
          <div className={styles.serverTitle}>
            <i className="devicon-amazonwebservices-plain-wordmark"></i>
            <span>AWS EC2 (Dockerized Environment)</span>
          </div>
          
          <div className={styles.flexRowGroup}>
            
            <div className={styles.colGroup}>
              <div className={styles.nodeBox} style={{ borderColor: '#6db33f' }}>
                <i className="devicon-spring-original" style={{ color: '#6db33f' }}></i>
                <span>Spring Boot 3.5</span>
                <span className={styles.subText}>(Java 21 / V-Threads)</span>
                <span className={styles.subText}>JWT (Access/Refresh/Socket)</span>
              </div>
              <div className={styles.innerNodes}>
                <div className={styles.nodeSm}>
                  <i className="devicon-redis-plain" style={{ color: '#dc382d' }}></i>
                  <span>Redis (Weather/Lock)</span>
                </div>
                <div className={styles.nodeSm}>
                  <i className="devicon-postgresql-plain" style={{ color: '#336791' }}></i>
                  <span>PostgreSQL</span>
                </div>
              </div>
            </div>

            <div className={styles.colGroup}>
              <div className={styles.queueNode}><span>SQS: daily_rec</span></div>
              <div className={styles.queueNode}><span>SQS: adjust_preview</span></div>
              <div className={styles.queueNode}><span>SQS: result_queue</span></div>
            </div>

            <div className={styles.colGroup}>
              <div className={styles.nodeBox} style={{ borderColor: '#009688' }}>
                <i className="devicon-fastapi-plain" style={{ color: '#009688' }}></i>
                <span>FastAPI AI Server</span>
                <span className={styles.subText}>(Python 3.12 / Uvicorn)</span>
                <span className={styles.subText}>FashionCLIP / rembg</span>
              </div>
              <div className={styles.innerNodes}>
                <div className={styles.nodeSm}>
                  <i className="devicon-amazonwebservices-plain-wordmark" style={{ color: '#ff9900' }}></i>
                  <span>Amazon S3 (Presigned)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.edgeRight}><span>External</span></div>
        
        {/* External APIs */}
        <div className={styles.colGroup}>
          <div className={`${styles.serverGroup}`}>
            <div className={styles.serverTitle}><span>External APIs</span></div>
            <div className={styles.innerNodesCol}>
              <div className={styles.nodeSm}><span>Kakao / Google OAuth</span></div>
              <div className={styles.nodeSm}><span>Firebase FCM (Push)</span></div>
              <div className={styles.nodeSm}><span>Meshy 3D API</span></div>
              <div className={styles.nodeSm}><span>KMA (기상청 API)</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function RobotPalArch() {
  return (
    <div className={styles.container}>
      <div className={styles.mainArch}>
        
        {/* Clients */}
        <div className={styles.colGroup}>
          <div className={styles.nodeBox} style={{ borderColor: '#3776AB' }}>
            <i className="devicon-python-plain" style={{ color: '#3776AB' }}></i>
            <span>JETANK (Nvidia ORIN)</span>
            <span className={styles.subText}>ROS2 Nav2 + STM32</span>
            <span className={styles.subText}>Python Bridge (control_bridge)</span>
          </div>
          <div className={styles.nodeBox} style={{ borderColor: '#E34F26', marginTop: '10px' }}>
            <i className="devicon-html5-plain" style={{ color: '#E34F26' }}></i>
            <span>WASM Browser Client</span>
            <span className={styles.subText}>COI Service Worker (COOP/COEP)</span>
            <span className={styles.subText}>Emscripten SharedArrayBuffer</span>
          </div>
        </div>
        
        <div className={styles.edgeRight}><span>TCP / WS</span></div>
        
        {/* Engine */}
        <div className={`${styles.serverGroup} ${styles.themeC}`}>
          <div className={styles.serverTitle}>
            <i className="devicon-cplusplus-plain"></i>
            <span>SimController (C++ Network Engine)</span>
          </div>
          
          <div className={styles.flexRowGroup}>
            <div className={styles.colGroup}>
              <div className={styles.nodeBox} style={{ borderColor: '#5586A4' }}>
                <i className="devicon-opengl-plain" style={{ color: '#5586A4' }}></i>
                <span>Render Thread</span>
                <span className={styles.subText}>OpenGL (glReadPixels)</span>
                <span className={styles.subText}>PBO Ping-Pong (Double Buffer)</span>
              </div>
            </div>
            
            <div className={styles.edgeRight}><span>Async</span></div>
            
            <div className={styles.colGroup}>
              <div className={styles.queueNode}><span>Concurrent Queue (Non-blocking)</span></div>
            </div>
            
            <div className={styles.edgeRight}><span>Pop</span></div>
            
            <div className={styles.colGroup}>
              <div className={styles.nodeBox} style={{ borderColor: '#00599C' }}>
                <i className="devicon-cplusplus-plain" style={{ color: '#00599C' }}></i>
                <span>Worker Threads (1~12)</span>
                <span className={styles.subText}>libjpeg-turbo Encode</span>
                <span className={styles.subText}>Independent Tx/Rx I/O</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MausoleumArch() {
  return (
    <div className={styles.container}>
      <div className={styles.mainArch}>
        
        {/* Clients */}
        <div className={styles.colGroup}>
          <div className={styles.nodeBox} style={{ borderColor: '#fff' }}>
            <i className="devicon-unrealengine-original"></i>
            <span>UE5 Client</span>
            <span className={styles.subText}>Opus Codec (FEC/DTX)</span>
            <span className={styles.subText}>HRTF 3D Audio / Jitter Buffer</span>
          </div>
        </div>
        
        <div className={styles.colGroup}>
          <div className={styles.edgeRight} style={{width:'30px', margin:'10px'}}><span>UDP</span></div>
          <div className={styles.edgeRight} style={{width:'30px', margin:'10px'}}><span>TCP</span></div>
        </div>
        
        {/* Servers */}
        <div className={styles.colGroup}>
          <div className={`${styles.serverGroup} ${styles.themeDocker}`}>
            <div className={styles.serverTitle}>
              <i className="devicon-docker-plain"></i>
              <span>Voice Server</span>
            </div>
            <div className={styles.nodeBox} style={{ borderColor: '#00599C' }}>
              <i className="devicon-cplusplus-plain" style={{ color: '#00599C' }}></i>
              <span>C++ uWebSockets (UDP)</span>
              <span className={styles.subText}>EPOLL / IOCP</span>
              <span className={styles.subText}>생사 분리 패턴 (Ghost vs Survivor)</span>
              <span className={styles.subText}>Protobuf 패킷 직렬화</span>
            </div>
          </div>
          
          <div className={`${styles.serverGroup}`}>
            <div className={styles.serverTitle}>
              <span>Game Server</span>
            </div>
            <div className={styles.nodeBox} style={{ borderColor: '#666' }}>
              <i className="devicon-unrealengine-original"></i>
              <span>Dedicated Game Server</span>
              <span className={styles.subText}>Count-based Phase Sync</span>
            </div>
          </div>
        </div>
        
        <div className={styles.edgeRight}><span>Deploy</span></div>
        
        {/* CI/CD */}
        <div className={styles.colGroup}>
          <div className={`${styles.serverGroup} ${styles.themeAws}`}>
            <div className={styles.serverTitle}>
              <i className="devicon-jenkins-line"></i>
              <span>Jenkins CI/CD</span>
            </div>
            <div className={styles.nodeBoxWrapper}>
              <div className={styles.nodeSm}><span>Webhook Trigger</span></div>
              <div className={styles.edgeDown}></div>
              <div className={styles.nodeSm}><span>Docker Build</span></div>
              <div className={styles.edgeDown}></div>
              <div className={styles.nodeSm}><i className="devicon-amazonwebservices-plain-wordmark"></i><span>AWS EC2</span></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
