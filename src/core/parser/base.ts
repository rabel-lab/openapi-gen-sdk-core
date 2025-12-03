import { Element } from '@swagger-api/apidom-core';
import { PredicateFunc } from '@/core/predicate';
import { ResolvedConfig } from '@/core/parser/operationId/action';

export type ParserCommandName = 'operationId' | 'sort';

export type ParserCommand<E extends Element> = (element: E, options?: Partial<ResolvedConfig>) => E;

export interface CommandParserHandler<PE extends Element = any> {
  name: ParserCommandName;
  predicate: PredicateFunc<PE>;
  handler: ParserCommand<PE>;
}

export interface ParserHandlersShape {
  operationId: CommandParserHandler<Element>[];
  sort: CommandParserHandler<Element>[];
}

export type CommandExecutor = {
  [Name in ParserCommandName]: ParserCommand<Element>;
};
