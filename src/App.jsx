import { lazy, Suspense } from 'react';
import About from './components/About';
import LoginModal from './components/admin/LoginModal';
import BackToTop from './components/BackToTop';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Loader from './components/Loader';
import Marquee from './components/Marquee';
import ProgressBar from './components/ProgressBar';
import Projects from './components/Projects';
import Skills from './components/Skills';
import SvgDefs from './components/ui/SvgDefs';
import { SiteProvider, useSite } from './context/SiteContext';
import { useRafScroll } from './hooks/useRafScroll';

// The editor is only downloaded after a successful login.
const AdminRoot = lazy(() => import('./components/admin/AdminRoot'));

function Site() {
  const { ready, admin, loginOpen } = useSite();

  // Expose scroll position to CSS (`--sy`) for the parallax doodles and the giant outline text.
  useRafScroll(() => document.documentElement.style.setProperty('--sy', scrollY));

  // Wait for the published content so visitors never see the default text flash and swap.
  if (!ready) return <Loader />;

  return (
    <>
      <Loader />
      <ProgressBar />
      <BackToTop />
      <SvgDefs />

      <Header />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />

      <CustomCursor />
      {loginOpen && <LoginModal />}
      {admin && (
        <Suspense fallback={null}>
          <AdminRoot />
        </Suspense>
      )}
    </>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <Site />
    </SiteProvider>
  );
}
