import { createStart } from '@tanstack/react-start';

import { authServerFunctionMiddleware } from './lib/auth/middlewares';

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [authServerFunctionMiddleware],
  };
});
