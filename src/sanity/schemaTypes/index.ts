import { destinationType } from "./destination";
import { homePageType } from "./homePage";
import {
  homePageFaqItemType,
  homePageFeatureType,
  homePageHighlightType,
  homePageQualityCheckType,
  homePageSectionHeadingType,
  homePageStageNoteType,
  homePageStageType,
} from "./homePageSections";
import {
  badgeType,
  contactColumnType,
  ctaBlockType,
  legalBlockType,
  linkColumnType,
  siteActionType,
  siteImageType,
  siteLinkType,
} from "./objects";
import { siteSettingsType } from "./siteSettings";

export const schemaTypes = [
  homePageType,
  siteSettingsType,
  siteImageType,
  destinationType,
  siteLinkType,
  badgeType,
  siteActionType,
  linkColumnType,
  contactColumnType,
  ctaBlockType,
  legalBlockType,
  homePageSectionHeadingType,
  homePageHighlightType,
  homePageFeatureType,
  homePageStageNoteType,
  homePageStageType,
  homePageQualityCheckType,
  homePageFaqItemType,
];
