// 이미지를 ES module로 import하면 Vite가 base URL과 해시를 자동으로 처리합니다.
import robotpalDemo    from "../../asset/로봇팔 시연.webp";
import robotpalFallback from "../../asset/project-robotpal-cover.png";
import autowingCover   from "../../asset/오토잉카_실물.png";
import autowingFallback from "../../asset/project-autowing-cover.png";
import mausoleumCover  from "../../asset/영묘.png";
import mausoleumFallback from "../../asset/project-mausoleum-cover.png";
import stickerCover    from "../../asset/Sticker.png";

export const coverImages = {
  robotpal:  { src: robotpalDemo,   fallback: robotpalFallback, fit: "contain" },
  autowing:  { src: autowingCover,  fallback: autowingFallback, fit: "contain" },
  mausoleum: { src: mausoleumCover, fallback: mausoleumFallback, fit: "contain" },
  sticker:   { src: stickerCover,   fallback: null, fit: "cover" },
};
