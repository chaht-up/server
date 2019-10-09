const { NODE_ENV } = process.env;

export const IS_PRODUCTION = !['development', 'test'].includes(NODE_ENV!);

export const nullCookie = () => ({
  expires: new Date(),
  httpOnly: true,
  sameSite: true,
  secure: IS_PRODUCTION,
});
