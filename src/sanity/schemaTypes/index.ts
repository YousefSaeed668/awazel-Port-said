import { destinationType } from "./destination";
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
];
