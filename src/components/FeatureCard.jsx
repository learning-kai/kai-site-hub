import { ArrowIcon } from "./icons.jsx";

const externalLinkProps = {
  rel: "noreferrer noopener",
  target: "_blank",
};

export function FeatureCard({ feature, t }) {
  const title = t[feature.titleKey];
  const image = (
    <a
      aria-label={`${title} 水墨演示背景`}
      className="card__painting"
      href={feature.href}
      {...externalLinkProps}
    >
      <span className="card__demo">
        <img
          alt=""
          aria-hidden="true"
          className="card__demo-bg"
          src={feature.image}
        />
        <img
          alt={`${title} 页面截图`}
          className="card__demo-shot"
          src={feature.screenshot}
        />
      </span>
    </a>
  );
  const text = (
    <div className="card__text">
      <h3>{title}</h3>
      <p>{t[feature.bodyKey]}</p>
      <a className="card__link" href={feature.href} {...externalLinkProps}>
        <span>{title}</span>
        <ArrowIcon className="card__link-arrow" />
      </a>
    </div>
  );

  return (
    <article className={`card card--${feature.id}`}>
      {feature.imageFirst ? image : text}
      {feature.imageFirst ? text : image}
    </article>
  );
}
