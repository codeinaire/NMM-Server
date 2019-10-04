import authenticate from './lib';

import { IEvent } from './types';

let data: IEvent;

// Lambda function index.handler - thin wrapper around lib.authenticate
export const auth = async (event: IEvent) => {
  try {
    data = await authenticate(event);
  }
  catch (err) {
    console.log(err);
    return `Unauthorized: ${err.message}`;
  }
  return data;
};
