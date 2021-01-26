import * as restify from 'restify';

export const handleError = (req: restify.Request, res: restify.Response, err, done) => {
  err.toJSON = () => {
    return {
      message: err.message
    }
  }

  switch (err.name) {
    case 'MongoError':
      if (err.code === 11000) {
        err.statusCode = 400;
      }
      break;
    
    case 'ValidationError':
      err.statusCode = 400;
      const message: any[] = [];
      for (let name in err.errors) {
        message.push({ message: err.errors[name].message });
      }
      err.toJSON = () => ({
        errors: message
      });
      break;
  }

  done();
}
