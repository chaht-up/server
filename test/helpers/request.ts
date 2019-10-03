import http from 'http';

interface IOptions {
  path: string;
  port: number;
  method: 'POST';
  body?: null | object;
  host?: string;
}

interface IResponse {
  code: number;
  body: object;
}

const request = (options: IOptions): Promise<IResponse> => new Promise((resolve, reject) => {
  const {
    path,
    port,
    method,
    body,
    host = 'localhost',
  } = options;

  http
    .request({
      port,
      host,
      method,
      path,
      headers: {
        'content-type': 'application/json',
      },
    })
    .on('response', (res) => {
      let responseBody = '';
      res
        .on('data', (chunk) => {
          responseBody += chunk.toString('utf8');
        })
        .on('end', () => {
          const result = {
            code: res.statusCode,
            body: JSON.parse(responseBody),
          };
          resolve(result);
        })
        .on('error', reject);
    })
    .on('error', reject)
    .end(body ? JSON.stringify(body) : null);
});

export default request;
