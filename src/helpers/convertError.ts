import ApiError from './ApiError';

const convertError = (error: Error): { message: string, code: number } => {
  console.error(error);

  if (error instanceof ApiError) {
    return error.responseData;
  }

  return { code: 500, message: error.message };
};

export default convertError;
