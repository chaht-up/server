import ApiError from './ApiError';
import { errors } from './messages';

const convertError = (error: Error): { message: string, code: number } => {
  console.error(error);

  if (error instanceof ApiError) {
    return error.responseData;
  }

  return { code: 500, message: errors.UNKNOWN_ERROR };
};

export default convertError;
