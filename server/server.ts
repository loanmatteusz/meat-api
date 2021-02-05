import * as mongoose from 'mongoose';
import * as restify from 'restify';

import { environment } from '../common/environment';
import { Router } from '../common/router';
import { mergePatchBodyParser } from './merge-patch.parser';
import { handleError } from './error.handler';

export class Server {

  application: restify.Server;

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        });
        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);

        this.application.on('restifyError', handleError);

        for (let router of routers) {
          router.applyRoutes(this.application);
        }

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });
      }
      catch (err) {
        reject(err);
      }
    });
  }

  inicializeDB(): mongoose.MongooseThenable {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(environment.db.url, {
      useMongoClient: true
    });
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.inicializeDB().then(() => this.initRoutes(routers).then(() => this));
  }

  shutdown() {
    return mongoose.disconnect()
      .then(() => this.application.close())
      .catch(console.error);
  }
}
