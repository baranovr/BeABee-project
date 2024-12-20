import AxiosMockAdapter from 'axios-mock-adapter';
import { httpApi } from '@app/api/http.api';
new AxiosMockAdapter(httpApi, { delayResponse: 1000 });
