import { portfolioDocument as doc } from "./data/portfolioData";
import { navItems } from "./data/navData";
import PortfolioPage from "./components/page/PortfolioPage";

export default function App() {
  return <PortfolioPage doc={doc} navItems={navItems} />;
}
