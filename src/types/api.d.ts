declare global {
  interface RequestOptions {
    method: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD');
    endpoint: string;
    headers?: Record<string, any>;
    data?: Record<string, any>;
    params?: Record<string, any>;
    requestKey?: string; // to generate a key for cancelation
  }

  interface APIResponse {
    ok: boolean,
    status: number,
    data: any,
    error?: any,
    headers: any;
  }
}

export { }
