const footerLinks = [
  { href: "https://blog.skyhold.cloud/", label: "Blog" },
  { href: "https://github.com/learning-kai", label: "GitHub" },
  { href: "https://imgbed.skyhold.cloud/", label: "ImgBed" },
  { href: "https://cloud.skyhold.cloud/", label: "Nextcloud" },
];

export function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__row">
          <span>{t.footerCopyright}</span>
          {footerLinks.map((link) => (
            <span className="footer__group" key={link.href}>
              <span className="footer__sep">|</span>
              <a
                className="footer__link"
                href={link.href}
                rel="noreferrer noopener"
                target="_blank"
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>
        <div className="footer__credit">
          <span>页面布局学习 </span>
          <a
            className="footer__link"
            href="https://mimo.xiaomi.com/zh/mimocode"
            rel="noreferrer noopener"
            target="_blank"
          >
            MiMo Code
          </a>
        </div>
      </div>
    </footer>
  );
}
