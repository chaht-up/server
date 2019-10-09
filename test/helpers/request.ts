import http from 'http';

interface IOptions {
  path: string;
  port: number;
  method: 'GET' | 'POST' | 'DELETE';
  body?: null | object;
  host?: string;
  headers?: object;
}

interface IResponse {
  res: http.IncomingMessage;
  body: object;
}

const request = (options: IOptions): Promise<IResponse> => new Promise((resolve, reject) => {
  const {
    path,
    port,
    method,
    body,
    headers = {},
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
        ...headers,
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
            res,
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
