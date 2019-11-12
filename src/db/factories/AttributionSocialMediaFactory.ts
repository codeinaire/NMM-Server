import { define } from 'typeorm-seeding';
import * as Faker from 'faker';

import AttributionSocialMedia from '../entities/AttributionSocialMedia';

define(AttributionSocialMedia, (faker: typeof Faker) => {
  const attributionSocialMedia = new AttributionSocialMedia()
  attributionSocialMedia.facebook = faker.internet.url()
  attributionSocialMedia.instragram = faker.internet.url()
  attributionSocialMedia.twitter = faker.internet.url()

  return attributionSocialMedia;
})