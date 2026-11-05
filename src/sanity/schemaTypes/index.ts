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
import { articleType } from "./article";
import { articleBodyObjectTypes } from "./articleBody";
import { authorType, blogSettingsType, blogTagType } from "./blogTaxonomy";
import {
  certificatesPageType,
  certificateRecordType,
} from "./certificatesPage";
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
import { privacyPageType } from "./privacyPage";
import { privacySectionType } from "./privacyPageSections";
import { servicesPageType } from "./servicesPage";
import {
  serviceApplicationType,
  serviceTechnologyType,
} from "./servicesPageSections";

export const schemaTypes = [
  privacyPageType,
  privacySectionType,
  homePageType,
  aboutPageType,
  certificatesPageType,
  servicesPageType,
  serviceApplicationType,
  serviceTechnologyType,
  siteSettingsType,
  articleType,
  authorType,
  blogTagType,
  blogSettingsType,
  certificateRecordType,
  siteImageType,
  destinationType,
  ...articleBodyObjectTypes,
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
