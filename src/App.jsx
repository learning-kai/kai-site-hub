import { useEffect, useMemo, useState } from "react";
import { FeatureSection } from "./components/FeatureSection.jsx";
import { Footer } from "./components/Footer.jsx";
import { Hero } from "./components/Hero.jsx";
import { getInitialLanguage, i18n } from "./i18n.js";

export default function App() {
  const [lang, setLang] = useState(getInitialLanguage);
  const copyText = "https://blog.skyhold.cloud/";
  const t = i18n[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const links = useMemo(() => {
    return {
      home: "https://blog.skyhold.cloud/",
      blog: "https://blog.skyhold.cloud/",
      github: "https://github.com/learning-kai",
      imgbed: "https://imgbed.skyhold.cloud/",
      nextcloud: "https://cloud.skyhold.cloud/",
      questionBank: "https://jianyantiku.skyhold.cloud/",
      review: "https://review.skyhold.cloud/",
    };
  }, []);

  return (
    <>
      <Hero
        copyText={copyText}
        lang={lang}
        links={links}
        setLang={setLang}
        t={t}
      />
      <FeatureSection lang={lang} t={t} />
      <Footer t={t} />
    </>
  );
}
