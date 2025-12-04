import { ParserCommandHandler } from '@/core/parser/base';
import { refractorPluginOpenapiOperationIdParser } from '@/core/parser/operationId/ns/openapi';
import { refractableParser } from '@/core/parser/types/refractable';
import { isOpenApi2, isOpenApi3x } from '@/core/predicate';

const operationIdCommand: ParserCommandHandler[] = [
  refractableParser('operationId', isOpenApi2, refractorPluginOpenapiOperationIdParser),
  refractableParser('operationId', isOpenApi3x, refractorPluginOpenapiOperationIdParser),
];
export default operationIdCommand;
