// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from 'cors'
import { Novu } from '@novu/node';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD']
});

const novu = new Novu(process.env.NEXT_PUBLIC_NOVU_API_KEY, {
    backendUrl: process.env.NEXT_BACKEND_API_URL
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
   
  // Run the middleware
  await runMiddleware(req, res, cors)

  const { subscriberId, email, firstName, lastName } = req.body;
    
  await novu.subscribers.identify(subscriberId, {
    email: email, 
    firstName: firstName,
    lastName: lastName,
  });

  res.json({
    subscriber: subscriberId,
    finish: true 
  });
}