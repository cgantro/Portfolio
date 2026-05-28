const pptx = require("pptxgenjs");

const pres = new pptx();
pres.defineLayout({ name:"WIDESCREEN_16_9", width:13.333, height:7.5 });
pres.layout = "WIDESCREEN_16_9";
pres.author = "yoonpyo";
pres.title  = "yoonpyo Portfolio";

require("./slides/s01-cover")(pres);
require("./slides/s02-summary")(pres);
require("./slides/s03-autowing")(pres);
require("./slides/s04-jwt")(pres);
require("./slides/s05-robotpal")(pres);
require("./slides/s06-mausoleum")(pres);
require("./slides/s07-sticker")(pres);
require("./slides/s08-subprojects")(pres);
require("./slides/s09-techstack")(pres);
require("./slides/s10-final")(pres);

pres.writeFile({ fileName:"yoonpyo-portfolio.pptx" })
  .then(() => console.log("✅  yoonpyo-portfolio.pptx 생성 완료"))
  .catch(e => console.error("❌  에러:", e));
