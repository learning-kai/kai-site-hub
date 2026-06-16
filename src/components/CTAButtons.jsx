import { ArrowIcon } from "./icons.jsx";

const externalLinkProps = {
  rel: "noreferrer noopener",
  target: "_blank",
};

export function CTAButtons({ links, t }) {
  return (
    <div className="ctas">
      <a className="btn btn--primary" href={links.blog} id="blogBtn" {...externalLinkProps}>
        <span>{t.primaryCta}</span>
        <ArrowIcon />
      </a>
      <a className="btn" href={links.github} {...externalLinkProps}>
        {t.githubCta}
        <ArrowIcon />
      </a>
      <a className="btn" href={links.nextcloud} id="cloudBtn" {...externalLinkProps}>
        <span>{t.cloudCta}</span>
        <ArrowIcon />
      </a>
    </div>
  );
}
