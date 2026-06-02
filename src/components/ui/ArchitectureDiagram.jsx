import styles from "./ArchitectureDiagram.module.css";
import robotpalArch  from "../../../asset/로봇팔_아키텍처.png";
import autowingArch  from "../../../asset/오토잉카_아키텍처.png";
import mausoleumArch from "../../../asset/영묘_아키텍처.png";
import stickerArch   from "../../../asset/스티커_아키텍처.png";

const ARCH_IMAGES = {
  robotpal:  robotpalArch,
  autowing:  autowingArch,
  mausoleum: mausoleumArch,
  sticker:   stickerArch,
};

export default function ArchitectureDiagram({ projectId }) {
  const src = ARCH_IMAGES[projectId];
  if (!src) return (
    <div className={styles.placeholder}>아키텍처 다이어그램이 준비되지 않았습니다.</div>
  );
  return (
    <div className={styles.imgWrap}>
      <img src={src} alt={`${projectId} 아키텍처`} className={styles.img} />
    </div>
  );
}
