import { PredicateFunc } from '@/core/predicate';

import { Element } from '@swagger-api/apidom-core';

export interface VisitHandler<E extends Element, T> {
  predicate: PredicateFunc<E>;
  handler: (element: E) => Readonly<T>;
}

export abstract class Visitor<T> {
  private handlers: VisitHandler<any, T>[] = [];
  constructor(handlers: VisitHandler<any, T>[] = []) {
    this.handlers = handlers;
  }
  visit(element: Element): T {
    for (const h of this.handlers) {
      if (h.predicate(element)) {
        return h.handler(element);
      }
    }
    throw new Error('Visitor: no handler found');
  }
}

/**
 * Create a VisitorHandler.
 * @param predicate - ElementPredicate<E>
 * @param handler - (element: E) => T
 * @returns - VisitorHandler<E, T>
 */
export function createVisitorHandler<E extends Element, T>(
  predicate: PredicateFunc<E>,
  handler: (element: E) => T,
): VisitHandler<E, T> {
  return { predicate, handler };
}
