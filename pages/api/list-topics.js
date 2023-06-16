// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from 'cors'
import { Novu } from '@novu/node';
import fetch from 'node-fetch';

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

  const page = 0;
  const pageSize = 20;

  //const response = await novu.topics.list({page, pageSize});

  const response = await fetch('https://api.novu.co/v1/topics', {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
    headers: {
        'Authorization': `ApiKey ${process.env.NEXT_PUBLIC_NOVU_API_KEY}`,
    }
  });

  const data = await response.json();

  res.json({
    data: data,
    finish: true 
  });
}