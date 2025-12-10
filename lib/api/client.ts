import { treaty } from '@elysiajs/eden';

import type { API } from './index';

export const apiClient = treaty<API>(process.env.NEXT_PUBLIC_APP_DOMAIN!).api;
