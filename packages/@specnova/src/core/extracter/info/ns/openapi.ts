import InfoExtracter from '@/core/extracter/info/extracter';
import { isOpenApi2, isOpenApi3x } from '@/core/predicate';
import { semver } from '@/types/semver';

import { toValue } from '@swagger-api/apidom-core';

const openapiInfoHandlers = [
  InfoExtracter.createHandler(isOpenApi2, (el) => {
    const openapiElement = el.get('swagger');
    const infoElement = el.get('info');
    const openapiValue = toValue(openapiElement);
    const infoValue = toValue(infoElement);
    return {
      openapi: openapiValue,
      title: infoValue.title,
      version: semver.parse(infoValue.version),
      license: infoValue.license,
    };
  }),
  InfoExtracter.createHandler(isOpenApi3x, (el) => {
    const openapiElement = el.get('openapi');
    const InfoElement = el.get('info');
    const openapiValue = toValue(openapiElement);
    const infoValue = toValue(InfoElement);
    return {
      openapi: openapiValue,
      title: infoValue.title,
      version: semver.parse(infoValue.version),
      license: infoValue.license,
    };
  }),
];

export default openapiInfoHandlers;
