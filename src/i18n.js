export const i18n = {
  zh: {
    heroTitle: "Kai",
    heroSubtitle:
      "Kai 的个人站点入口，集中访问博客、GitHub、图床和 Nextcloud。",
    primaryCta: "进入博客",
    githubCta: "GitHub",
    cloudCta: "Nextcloud",
    copyLabel: "复制主页链接",
    copiedLabel: "已复制",
    featuresTitle: "Kai 的站点导航",
    cardBlogTitle: "Kai's Blog",
    cardBlogBody:
      "归档 Kai 的文章、折腾记录和项目笔记，主页入口默认指向这里。",
    cardGithubTitle: "GitHub",
    cardGithubBody:
      "查看 learning-kai 的公开仓库、代码实验和项目更新。",
    cardImgbedTitle: "我的图床",
    cardImgbedBody:
      "用于管理和分享图片资源的公开入口，适合快速上传与分发。",
    cardNextcloudTitle: "Nextcloud",
    cardNextcloudBody:
      "私有云盘入口，公开访问状态展示登录页，登录后进入个人云空间。",
    footerCopyright: "Copyright 2026 Kai. All Rights Reserved",
  },
  en: {
    heroTitle: "Kai",
    heroSubtitle:
      "A personal launchpad for Kai's public web spaces: blog, GitHub, image bed, and Nextcloud.",
    primaryCta: "Open blog",
    githubCta: "GitHub",
    cloudCta: "Nextcloud",
    copyLabel: "Copy homepage link",
    copiedLabel: "Copied",
    featuresTitle: "Kai's site hub",
    cardBlogTitle: "Kai's Blog",
    cardBlogBody:
      "Archives for Kai's posts, build notes, and project writing. This is the main homepage target.",
    cardGithubTitle: "GitHub",
    cardGithubBody:
      "Browse learning-kai's public repositories, code experiments, and project updates.",
    cardImgbedTitle: "Image bed",
    cardImgbedBody:
      "A public entry for managing and sharing image assets with quick upload and delivery.",
    cardNextcloudTitle: "Nextcloud",
    cardNextcloudBody:
      "Private cloud storage entry. Public access shows the login screen before entering the cloud workspace.",
    footerCopyright: "Copyright 2026 Kai. All Rights Reserved",
  },
};

export function getInitialLanguage() {
  return new URLSearchParams(window.location.search).get("lang") === "en"
    ? "en"
    : "zh";
}

export const features = [
  {
    id: 1,
    image: "/coder/assets/feature-model.png",
    screenshot: "/coder/assets/site-blog.png",
    href: "https://blog.skyhold.cloud/",
    titleKey: "cardBlogTitle",
    bodyKey: "cardBlogBody",
    altKey: "cardBlogTitle",
    imageFirst: true,
  },
  {
    id: 2,
    image: "/coder/assets/feature-agent.png",
    screenshot: "/coder/assets/site-github.png",
    href: "https://github.com/learning-kai",
    titleKey: "cardGithubTitle",
    bodyKey: "cardGithubBody",
    altKey: "cardGithubTitle",
    imageFirst: false,
  },
  {
    id: 3,
    image: "/coder/assets/feature-context.png",
    screenshot: "/coder/assets/site-imgbed.png",
    href: "https://imgbed.skyhold.cloud/",
    titleKey: "cardImgbedTitle",
    bodyKey: "cardImgbedBody",
    altKey: "cardImgbedTitle",
    imageFirst: true,
  },
  {
    id: 4,
    image: "/coder/assets/feature-evolution.png",
    screenshot: "/coder/assets/site-nextcloud.png",
    href: "https://cloud.skyhold.cloud/",
    titleKey: "cardNextcloudTitle",
    bodyKey: "cardNextcloudBody",
    altKey: "cardNextcloudTitle",
    imageFirst: false,
  },
];
