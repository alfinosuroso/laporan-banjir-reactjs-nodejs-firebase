import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-cyan-50">{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;