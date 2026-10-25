import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import BackToTop from "@/components/back-to-top";
import GlobeIcon from "@/components/globe-icon";
import ThemeToggle from "@/components/theme-toggle";
import "./globals.css";

const nunitoSans = Nunito_Sans({ subsets: ["latin"] });
const themeScript = `(function(){var t;try{t=localStorage.getItem('countries-theme')}catch(e){}document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()`;

export const metadata: Metadata = {
  title: "Lista de países",
  description: "Um mundo de descobertas. Explore países, capitais, idiomas e fronteiras.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={nunitoSans.className}>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <header id="topo" className="site-header">
          <div className="shell header-inner">
            <Link href="/" className="brand" aria-label="Lista de países — início">
              <span className="brand-mark" aria-hidden="true">
                <Image
                  src="/brand-globe.svg"
                  alt=""
                  width={43}
                  height={43}
                  className="brand-globe"
                />
              </span>
              <span>
                Lista de países
                <span className="brand-caption">UM MUNDO PARA EXPLORAR</span>
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main id="conteudo" className="shell main-content">
          {children}
        </main>
        <footer className="shell site-footer">
          <span>O mundo começa com uma descoberta.</span>
          <span>
            Feito para quem tem curiosidade <GlobeIcon className="footer-globe" />
          </span>
        </footer>
        <BackToTop />
      </body>
    </html>
  );
}
