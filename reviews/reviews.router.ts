import * as restify from 'restify';

import { ModelRouter } from '../common/model-router';
import { Review } from './reviews.model';

class ReviewRouter extends ModelRouter<Review> {
  constructor () {
    super(Review);
  }

  envelop(document) {
    let resource = super.envelop(document);
    const restaurant_id = document.restaurant._id ? document.restaurant._id : document.restaurant;
    resource._links.restaurant = `/restaurants/${restaurant_id}`;
    return resource;
  }

  findAll = (req, res, next) => {
    this.model.find()
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .then(this.renderAll(res, next))
      .catch(next);
  }

  findById = (req, res, next) => {
    this.model.findById(req.params.id)
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .then(this.render(res, next))
      .catch(next);
  }

  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, this.findAll);
    application.get(`${this.basePath}/:id`, this.validateId, this.findById);
    application.post(`${this.basePath}`, this.create);
  }
}

export const reviewRouter = new ReviewRouter();
