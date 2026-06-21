import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const navConfig = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../src/nav.config.json"), "utf8"),
);

const BLOG_URL = "https://blog.skyhold.cloud/";
const GITHUB_URL = "https://github.com/learning-kai";
const IMGBED_URL = "https://imgbed.skyhold.cloud/";
const NEXTCLOUD_URL = "https://cloud.skyhold.cloud/";
const QUESTION_BANK_URL = "https://jianyantiku.skyhold.cloud/";
const REVIEW_URL = "https://review.skyhold.cloud/";
const MIMO_URL = "https://mimo.xiaomi.com/zh/mimocode";
const FEATURE_IMAGES = [
  "/coder/assets/feature-model.png",
  "/coder/assets/feature-agent.png",
  "/coder/assets/feature-context.png",
  "/coder/assets/feature-evolution.png",
];
const SITE_SCREENSHOTS = [
  "/coder/assets/site-blog.png",
  "/coder/assets/site-github.png",
  "/coder/assets/site-imgbed.png",
  "/coder/assets/site-nextcloud.png",
];

async function openHome(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
}

test("renders Kai's personal portal in Chinese", async ({ page }) => {
  await openHome(page);

  await expect(page.getByRole("heading", { name: "Kai", exact: true })).toBeVisible();
  await expect(page.getByText("Kai 的个人站点入口")).toBeVisible();
  await expect(page.getByText(BLOG_URL)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kai 的站点导航" })).toBeVisible();
  await expect(page.locator(".card")).toHaveCount(4);
});

test("wires the public Kai links", async ({ page }) => {
  await openHome(page);

  await expect(page.locator("#navHome")).toHaveAttribute("href", BLOG_URL);
  await expect(page.locator("#navGithub")).toHaveAttribute("href", GITHUB_URL);
  await expect(page.locator("#navBlog")).toHaveAttribute("href", BLOG_URL);
  await expect(page.locator("#navImgbedTop")).toHaveAttribute("href", IMGBED_URL);
  await expect(page.locator("#navNextcloudTop")).toHaveAttribute("href", NEXTCLOUD_URL);

  await page.getByText("产品").hover();
  const productMenu = page.locator(".hero__product-menu");
  await expect(productMenu.getByRole("menuitem")).toHaveCount(2);
  await expect(page.locator("#navQuestionBank")).toHaveAttribute("href", QUESTION_BANK_URL);
  await expect(page.locator("#navQuestionBank")).toHaveText("检验题库");
  await expect(page.locator("#navReview")).toHaveAttribute("href", REVIEW_URL);
  await expect(page.locator("#navReview")).toHaveText("习概期末");
  await expect(productMenu).toHaveCSS("flex-direction", "row");
});

test("renders the top navigation from the editable config", async ({ page }) => {
  await openHome(page);

  await expect(page.locator("#navHome")).toHaveAttribute("href", navConfig.home.href);

  for (const item of navConfig.items) {
    if (item.type === "link") {
      await expect(page.locator(`#${item.id}`)).toHaveAttribute("href", item.href);
      await expect(page.locator(`#${item.id}`)).toHaveText(item.label.zh);
    }

    if (item.type === "dropdown") {
      await page.getByRole("button", { name: item.label.zh }).hover();
      const menu = page.locator(`#${item.id}Menu`);
      await expect(menu.getByRole("menuitem")).toHaveCount(item.items.length);

      for (const child of item.items) {
        await expect(page.locator(`#${child.id}`)).toHaveAttribute("href", child.href);
        await expect(page.locator(`#${child.id}`)).toHaveText(child.label.zh);
      }
    }
  }
});

test("loads the local screenshot assets", async ({ page }) => {
  await openHome(page);
  await page.waitForFunction(() =>
    [...document.images].every((img) => img.complete && img.naturalWidth > 0),
  );

  const assets = await page.evaluate(() => {
    const heroBg = getComputedStyle(document.querySelector(".hero__bg")!).backgroundImage;
    const demos = [...document.querySelectorAll<HTMLElement>(".card__demo")].map(
      (demo) => ({
        bg: demo.querySelector<HTMLImageElement>(".card__demo-bg")?.getAttribute("src"),
        bgComplete: demo.querySelector<HTMLImageElement>(".card__demo-bg")?.complete,
        bgWidth: demo.querySelector<HTMLImageElement>(".card__demo-bg")?.naturalWidth,
        shot: demo.querySelector<HTMLImageElement>(".card__demo-shot")?.getAttribute("src"),
        shotAlt: demo.querySelector<HTMLImageElement>(".card__demo-shot")?.alt,
        shotComplete: demo.querySelector<HTMLImageElement>(".card__demo-shot")?.complete,
        shotWidth: demo.querySelector<HTMLImageElement>(".card__demo-shot")?.naturalWidth,
      }),
    );
    const allImages = [...document.querySelectorAll<HTMLImageElement>(".card__demo img")].map(
      (img) => ({
        alt: img.alt,
        src: img.getAttribute("src"),
        complete: img.complete,
        width: img.naturalWidth,
      }),
    );
    return { heroBg, demos, allImages };
  });

  expect(assets.heroBg).toContain("/coder/assets/");
  expect(assets.demos).toHaveLength(4);
  expect(assets.demos.map((image) => image.bg)).toEqual(FEATURE_IMAGES);
  expect(assets.demos.map((image) => image.shot)).toEqual(SITE_SCREENSHOTS);
  expect(assets.allImages).toHaveLength(8);
  for (const image of assets.demos) {
    expect(image.bgComplete).toBe(true);
    expect(image.bgWidth).toBeGreaterThan(0);
    expect(image.shotAlt).toContain("页面截图");
    expect(image.shotComplete).toBe(true);
    expect(image.shotWidth).toBeGreaterThan(0);
  }
});

test("matches the MiMo-style feature card layout and demo image sizing", async ({ page }) => {
  await openHome(page);

  const layout = await page.evaluate(() => {
    const list = document.querySelector(".features__list")!;
    const cards = [...document.querySelectorAll<HTMLElement>(".card")].map((card) => {
      const cardRect = card.getBoundingClientRect();
      const image = card.querySelector<HTMLElement>(".card__painting")!.getBoundingClientRect();
      const demo = card.querySelector<HTMLElement>(".card__demo")!.getBoundingClientRect();
      const bg = card.querySelector<HTMLImageElement>(".card__demo-bg")!.getBoundingClientRect();
      const bgElement = card.querySelector<HTMLImageElement>(".card__demo-bg")!;
      const shot = card.querySelector<HTMLImageElement>(".card__demo-shot")!.getBoundingClientRect();
      const shotElement = card.querySelector<HTMLImageElement>(".card__demo-shot")!;
      const text = card.querySelector<HTMLElement>(".card__text")!.getBoundingClientRect();
      return {
        cardHeight: Math.round(cardRect.height),
        cardWidth: Math.round(cardRect.width),
        imageLeft: Math.round(image.left - cardRect.left),
        imageTop: Math.round(image.top - cardRect.top),
        imageWidth: Math.round(image.width),
        imageHeight: Math.round(image.height),
        demoWidth: Math.round(demo.width),
        demoHeight: Math.round(demo.height),
        bgSrc: bgElement.getAttribute("src"),
        bgWidth: Math.round(bg.width),
        bgHeight: Math.round(bg.height),
        shotSrc: shotElement.getAttribute("src"),
        shotLeft: Math.round(shot.left - image.left),
        shotTop: Math.round(shot.top - image.top),
        shotWidth: Math.round(shot.width),
        shotHeight: Math.round(shot.height),
        textLeft: Math.round(text.left - cardRect.left),
        textTop: Math.round(text.top - cardRect.top),
        textWidth: Math.round(text.width),
        visibleTextLinks: card.querySelectorAll(".card__link").length,
      };
    });
    return {
      listWidth: Math.round(list.getBoundingClientRect().width),
      cards,
    };
  });

  expect(layout.listWidth).toBe(1100);
  expect(layout.cards).toHaveLength(4);
  expect(layout.cards.map((card) => card.cardHeight)).toEqual([360, 360, 360, 360]);
  expect(layout.cards.map((card) => card.cardWidth)).toEqual([1100, 1100, 1100, 1100]);
  expect(layout.cards.map((card) => card.imageLeft)).toEqual([0, 527, 0, 527]);
  expect(layout.cards.map((card) => card.bgSrc)).toEqual(FEATURE_IMAGES);
  expect(layout.cards.map((card) => card.shotSrc)).toEqual(SITE_SCREENSHOTS);
  expect(layout.cards.map((card) => card.textLeft)).toEqual([648, 129, 645, 122]);
  expect(layout.cards.map((card) => card.textTop)).toEqual([136, 130, 114, 107]);
  for (const card of layout.cards) {
    expect(card.imageTop).toBe(0);
    expect(card.imageWidth).toBe(573);
    expect(card.imageHeight).toBe(360);
    expect(card.demoWidth).toBe(573);
    expect(card.demoHeight).toBe(360);
    expect(card.bgWidth).toBe(573);
    expect(card.bgHeight).toBe(360);
    expect(card.textWidth).toBe(331);
    expect(card.visibleTextLinks).toBe(1);
  }
  expect(layout.cards.map((card) => card.shotWidth)).toEqual([530, 548, 530, 500]);
  expect(layout.cards.map((card) => card.shotHeight)).toEqual([304, 314, 304, 285]);
  expect(layout.cards.map((card) => card.shotLeft)).toEqual([21, 12, 21, 36]);
  expect(layout.cards.map((card) => card.shotTop)).toEqual([18, 23, 28, 38]);
});

test("copies the homepage link", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await openHome(page);

  await page.getByRole("button", { name: "复制主页链接" }).click();

  await expect(page.getByText("已复制")).toBeVisible();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(BLOG_URL);
});

test("switches language from Chinese to English", async ({ page }) => {
  await openHome(page);

  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("menuitem", { name: "English" }).click();

  await expect(page.getByText("Kai's site hub")).toBeVisible();
  await expect(page.getByText("A personal launchpad for Kai's public web spaces: blog, GitHub, image bed, and Nextcloud.")).toBeVisible();
  await expect(page.locator("#navBlog")).toHaveText("Blog");
});

test("shows the MiMo Code attribution in the footer", async ({ page }) => {
  await openHome(page);

  const credit = page.locator(".footer__credit");
  await expect(credit).toContainText("页面布局学习");
  await expect(credit.getByRole("link", { name: "MiMo Code" })).toHaveAttribute("href", MIMO_URL);
});
