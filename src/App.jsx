import { useEffect, useMemo, useState } from "react";
import { FeatureSection } from "./components/FeatureSection.jsx";
import { Footer } from "./components/Footer.jsx";
import { Hero } from "./components/Hero.jsx";
import { getInitialLanguage, i18n } from "./i18n.js";
import navConfig from "./nav.config.json";

function collectNamedLinks(config) {
  const links = {
    home: config.home.href,
  };

  for (const item of config.items) {
    if (item.type === "link" && item.key) {
      links[item.key] = item.href;
    }
  }

  return links;
}

export default function App() {
  const [lang, setLang] = useState(getInitialLanguage);
  const t = i18n[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const links = useMemo(() => collectNamedLinks(navConfig), []);
  const copyText = links.home;

  return (
    <>
      <Hero
        copyText={copyText}
        lang={lang}
        links={links}
        navConfig={navConfig}
        setLang={setLang}
        t={t}
      />
      <FeatureSection lang={lang} t={t} />
      <Footer t={t} />
    </>
  );
}
