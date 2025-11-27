import { isOpenApi2, isOpenApi3x } from '@/core/predicate';
import { createVisitorHandler, Visitor, VisitorHandler } from '@/core/visitors';
import { toValue } from '@swagger-api/apidom-core';

export type Info = {
  title: string;
  version: string;
  license?: {
    name: string;
    url: string;
  };
};

type VisitorHandlers = VisitorHandler<any, Info>[];

const infoHandlers: VisitorHandlers = [
  createVisitorHandler(isOpenApi2, (el) => {
    const openapiElement = el.get('swagger');
    const InfoElement = el.get('info');
    const openapiValue = toValue(openapiElement);
    const infoValue = toValue(InfoElement);
    return {
      openapi: openapiValue,
      title: infoValue.title,
      version: infoValue.version,
      license: infoValue.license,
    };
  }),
  createVisitorHandler(isOpenApi3x, (el) => {
    const openapiElement = el.get('openapi');
    const InfoElement = el.get('info');
    const openapiValue = toValue(openapiElement);
    const infoValue = toValue(InfoElement);
    return {
      openapi: openapiValue,
      title: infoValue.title,
      version: infoValue.version,
      license: infoValue.license,
    };
  }),
];

class InfoVisitor extends Visitor<Info> {
  constructor(handlers: VisitorHandlers = infoHandlers) {
    super(infoHandlers);
  }
}

export const infoVisitor = new InfoVisitor();
