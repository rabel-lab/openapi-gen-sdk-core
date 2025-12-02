import { Element } from '@swagger-api/apidom-core';
import { PredicateFunc } from '@/core/predicate';
import { ResolvedConfig } from '@/core/parser/operationId/action';

type ParserCommandName = 'operationId' | 'sort';

type ParserCommand<E extends Element> = (element: E, options?: Partial<ResolvedConfig>) => E;

export interface CommandParserHandler<PE extends Element = any> {
  name: ParserCommandName;
  predicate: PredicateFunc<PE>;
  handler: ParserCommand<PE>;
}

export interface ParserHandlersShape {
  operationId: CommandParserHandler<Element>[];
  sort: CommandParserHandler<Element>[];
}

type CommandExecutor = {
  [Name in ParserCommandName]: ParserCommand<Element>;
};

export class ParserCommander implements CommandExecutor {
  private handlers: ParserHandlersShape = {
    operationId: [],
    sort: [],
  };
  constructor(handlers?: ParserHandlersShape) {
    if (handlers) {
      this.handlers = handlers;
    }
  }
  push(...handlers: CommandParserHandler<Element>[]) {
    for (const h of handlers) {
      switch (h.name) {
        case 'operationId':
          this.handlers.operationId.push(h);
          break;
        case 'sort':
          this.handlers.sort.push(h);
          break;
        default:
          throw new Error('ParserCommander: unknown command');
      }
    }
  }
  operationId<T extends Element>(element: T, options?: Partial<ResolvedConfig>): T {
    for (const h of this.handlers.operationId) {
      if (h.predicate(element)) {
        return h.handler(element, options) as T;
      }
    }
    throw new Error('ParserCommander: no handler found');
  }
  sort<T extends Element>(element: T, options?: Partial<ResolvedConfig>): T {
    for (const h of this.handlers.sort) {
      if (h.predicate(element)) {
        return h.handler(element, options) as T;
      }
    }
    throw new Error('ParserCommander: no handler found');
  }
}
