import { expect } from 'chai';
import convertError from '../../src/helpers/convertError';
import ApiError from '../../src/helpers/ApiError';

describe('convertError', () => {
  it('converts native error messages with a 500 code and the error message', () => {
    const message = 'something bad';
    const error = Error(message);
    expect(convertError(error)).to.eql({ code: 500, message });
  });

  it('converts ApiError with responseData', () => {
    const message = 'something bad';
    const code = 404;
    const error = new ApiError(message, code);
    expect(convertError(error)).to.eql({ code, message });
  });
});
