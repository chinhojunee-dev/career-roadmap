import type { CareerApi } from './CareerApi';
import { mockCareerApi } from './mock/mockCareerApi';

/** 지금은 mock. 서버/AI 연동 시 httpCareerApi 로 바꿔 끼운다. (화면 코드는 그대로) */
export const careerApi: CareerApi = mockCareerApi;
export type { CareerApi };
