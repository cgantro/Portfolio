// 이미지를 ES module로 import하면 Vite가 base URL과 해시를 자동으로 처리합니다.
import robotpalDemo    from "../../asset/로봇팔 시연.webp";
import robotpalFallback from "../../asset/project-robotpal-cover.png";
import mausoleumCover  from "../../asset/영묘.png";
import mausoleumFallback from "../../asset/project-mausoleum-cover.png";
import stickerCover    from "../../asset/Sticker.png";

export const coverImages = {
  robotpal:  { src: robotpalDemo,   fallback: robotpalFallback },
  mausoleum: { src: mausoleumCover, fallback: mausoleumFallback },
  sticker:   { src: stickerCover,   fallback: null },
};
