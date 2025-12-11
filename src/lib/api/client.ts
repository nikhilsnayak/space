import { treaty } from '@elysiajs/eden';

import type { API } from './index';

export const apiClient = treaty<API>(import.meta.env.VITE_APP_DOMAIN!).api;
