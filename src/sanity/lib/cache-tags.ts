export const SITE_SETTINGS_TAG = "site-settings";
export const HOME_PAGE_TAG = "home-page";
export const ABOUT_PAGE_TAG = "about-page";
export const CERTIFICATES_PAGE_TAG = "certificates-page";
export const BLOG_ARTICLES_TAG = "blog-articles";
export const BLOG_AUTHORS_TAG = "blog-authors";
export const BLOG_TAGS_TAG = "blog-tags";
export const BLOG_SETTINGS_TAG = "blog-settings";

export function articleTag(id: string) {
  return `article:${id}`;
}
