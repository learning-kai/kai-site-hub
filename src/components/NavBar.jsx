import { CaretIcon } from "./icons.jsx";

const externalLinkProps = {
  rel: "noreferrer noopener",
  target: "_blank",
};

function getLabel(item, lang) {
  return item.label?.[lang] || item.label?.zh || "";
}

export function NavBar({ lang, navConfig, setLang }) {
  const homeHref = navConfig.home.href;

  return (
    <>
      <a
        aria-label="Kai"
        className="hero__logo-link hero__wordmark"
        href={homeHref}
        id="navHome"
        {...externalLinkProps}
      >
        Kai
      </a>

      <div aria-hidden="true" className="hero__divider" />

      <div className="hero__bar">
        <nav aria-label="Main navigation" className="hero__nav">
          {navConfig.items.map((item) => {
            if (item.type === "dropdown") {
              return (
                <div className="hero__nav-dropdown" key={item.id}>
                  <button
                    className="hero__nav-link hero__nav-dropdown-trigger"
                    id={item.id}
                    type="button"
                  >
                    <span>{getLabel(item, lang)}</span>
                    <CaretIcon />
                  </button>
                  <div
                    className="hero__nav-menu hero__product-menu"
                    id={`${item.id}Menu`}
                    role="menu"
                  >
                    {item.items.map((child) => (
                      <a
                        className="hero__nav-menu-item"
                        href={child.href}
                        id={child.id}
                        key={child.id}
                        role="menuitem"
                        {...externalLinkProps}
                      >
                        {getLabel(child, lang)}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <a
                className="hero__nav-link"
                href={item.href}
                id={item.id}
                key={item.id}
                {...externalLinkProps}
              >
                {getLabel(item, lang)}
              </a>
            );
          })}
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
