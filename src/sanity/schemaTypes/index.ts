import { aboutPageType } from "./aboutPage";
import {
  aboutBreadcrumbType,
  aboutCapabilityType,
  aboutFactType,
  aboutParagraphType,
  aboutStageNoteType,
  aboutStageType,
  aboutValueCheckType,
  aboutValueType,
} from "./aboutPageSections";
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
  aboutPageType,
  siteSettingsType,
  siteImageType,
  destinationType,
  aboutBreadcrumbType,
  aboutParagraphType,
  aboutFactType,
  aboutCapabilityType,
  aboutStageNoteType,
  aboutStageType,
  aboutValueCheckType,
  aboutValueType,
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
