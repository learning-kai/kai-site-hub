import { CaretIcon } from "./icons.jsx";

const externalLinkProps = {
  rel: "noreferrer noopener",
  target: "_blank",
};

export function NavBar({ lang, links, setLang, t }) {
  const productLinks = [
    {
      href: links.questionBank,
      id: "navQuestionBank",
      label: t.navQuestionBank,
    },
  ];

  return (
    <>
      <a
        aria-label="Kai"
        className="hero__logo-link hero__wordmark"
        href={links.home}
        id="navHome"
        {...externalLinkProps}
      >
        Kai
      </a>

      <div aria-hidden="true" className="hero__divider" />

      <div className="hero__bar">
        <nav aria-label="Main navigation" className="hero__nav">
          <div className="hero__nav-dropdown">
            <button
              className="hero__nav-link hero__nav-dropdown-trigger"
              type="button"
            >
              <span>{t.navProduct}</span>
              <CaretIcon />
            </button>
            <div className="hero__nav-menu hero__product-menu" role="menu">
              {productLinks.map((item) => (
                <a
                  className="hero__nav-menu-item"
                  href={item.href}
                  id={item.id}
                  key={item.id}
                  role="menuitem"
                  {...externalLinkProps}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <a
            className="hero__nav-link"
            href={links.blog}
            id="navBlog"
            {...externalLinkProps}
          >
            {t.navBlog}
          </a>
          <a
            className="hero__nav-link"
            href={links.github}
            id="navGithub"
            {...externalLinkProps}
          >
            {t.navGithub}
          </a>
          <a
            className="hero__nav-link"
            href={links.imgbed}
            id="navImgbedTop"
            {...externalLinkProps}
          >
            {t.navImgbed}
          </a>
          <a
            className="hero__nav-link"
            href={links.nextcloud}
            id="navNextcloudTop"
            {...externalLinkProps}
          >
            {t.navNextcloud}
          </a>
        </nav>

        <div className="hero__lang hero__nav-dropdown">
          <button
            aria-label="Language"
            className="hero__lang-trigger hero__nav-dropdown-trigger"
            type="button"
          >
            <img
              alt=""
              className="hero__lang-icon"
              src="/coder/assets/icon-translate.svg"
            />
            <CaretIcon />
          </button>
          <div className="hero__nav-menu hero__lang-menu" role="menu">
            <button
              className={`hero__nav-menu-item hero__lang-option ${
                lang === "zh" ? "is-active" : ""
              }`}
              onClick={() => setLang("zh")}
              role="menuitem"
              type="button"
            >
              简体中文
            </button>
            <button
              className={`hero__nav-menu-item hero__lang-option ${
                lang === "en" ? "is-active" : ""
              }`}
              onClick={() => setLang("en")}
              role="menuitem"
              type="button"
            >
              English
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
