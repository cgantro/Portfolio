// 이미지를 ES module로 import하면 Vite가 base URL과 해시를 자동으로 처리합니다.
import robotpalDemo    from "../../asset/로봇팔 시연.webp";
import autowingCover   from "../../asset/오토잉카_실물.png";
import mausoleumCover  from "../../asset/영묘.png";
import stickerCover    from "../../asset/Sticker.png";

export const coverImages = {
  robotpal:  { src: robotpalDemo,   fallback: null, fit: "contain" },
  autowing:  { src: autowingCover,  fallback: null, fit: "contain" },
  mausoleum: { src: mausoleumCover, fallback: null, fit: "contain" },
  sticker:   { src: stickerCover,   fallback: null, fit: "cover" },
};
