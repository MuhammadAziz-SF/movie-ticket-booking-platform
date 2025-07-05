import * as grpc from '@grpc/grpc-js';

export const writeToCookie = (metadata: grpc.Metadata, key: string, value: string) => {
  const maxAgeInSeconds = 7 * 24 * 60 * 60; 
  const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  
  const cookieHeader = `${key}=${value}; HttpOnly; ${secureFlag} Max-Age=${maxAgeInSeconds}; SameSite=Strict; Path=/`;
  
  metadata.add('set-cookie', cookieHeader);
};


export const clearCookie = (metadata: grpc.Metadata, key: string) => {
  const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure;' : '';

  // To clear a cookie, set its Max-Age to 0.
  const cookieHeader = `${key}=; HttpOnly; ${secureFlag} Max-Age=0; SameSite=Strict; Path=/`;

  metadata.add('set-cookie', cookieHeader);
};
