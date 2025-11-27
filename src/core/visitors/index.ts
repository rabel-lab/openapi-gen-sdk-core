import { Element } from '@swagger-api/apidom-core';
import { PredicateFunc } from '../predicate';
import InfoVisitor from '@/core/visitors/infoVisitor';

/* ========================================================================== 
 * Base
 ========================================================================== */

export interface VisitorHandler<E extends Element, T> {
  predicate: PredicateFunc<E>;
  handler: (element: E) => Readonly<T>;
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
): VisitorHandler<E, T> {
  return { predicate, handler };
}

export abstract class Visitor<T> {
  private handlers: VisitorHandler<any, T>[] = [];
  constructor(handlers: VisitorHandler<any, T>[] = []) {
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

/* ============================================================================
 * Visitors
 ============================================================================ */
export const infoVisitor = new InfoVisitor();
