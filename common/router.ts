import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

export abstract class Router extends EventEmitter {
  abstract applyRoutes(application: restify.Server)

  envelop(document: any): any {
    return document;
  }

  envelopAll(documents: any[]): any {
    return documents;
  }

  render(res: restify.Response, next: restify.Next) {
    return (document: any) => {
      if (document) {
        this.emit('beforeRender', document);
        res.json(this.envelop(document));
      }
      else {
        throw new NotFoundError('Document not found');
      }

      return next();
    }
  }

  renderAll(res: restify.Response, next: restify.Next) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((document, index, array) => {
          this.emit('beforeRender', document);
          array[index] = this.envelop(document);
        });
        res.json(this.envelopAll(documents));
      }
      else {
        res.json(this.envelopAll([]));
      }

      return next();
    }
  }
}
