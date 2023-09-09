import { Base64, HttpResponse } from '@ysera/nsx-common';
import * as jwt from 'jsonwebtoken';
import { ExecutionContext } from '@nestjs/common';
import { tryGet } from '@ysera/agx-util';
import { HttpRequest } from '@ysera/nsx-common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JWT_BEARER_REALM } from '@ysera/agx-dto';

export const decodeURITokenComponent = <T>(
  urlEncodedToken: string,
  secret: string
): T | undefined => {
  const b64Encoded = decodeURIComponent(urlEncodedToken);
  const singedToken = Base64.decode(b64Encoded);
  try {
    return jwt.verify(singedToken, secret) as T;
  } catch (err) {
    return undefined;
  }
};

export const getCookiesFromContext = (context: ExecutionContext): string[] => {
  const request = getRequestFromContext(context);
  return tryGet<string[]>(() => request?.cookies, []);
};

export const getCookieFromContext = (context: ExecutionContext, name: string): string => {
  const cookies = getCookiesFromContext(context);
  return tryGet<string>(() => cookies[name], undefined);
};

export const convertExecutionContextToGqlContext = (context: ExecutionContext) => {
  return GqlExecutionContext.create(context).getContext();
};

export const getRequestFromContext = (context: ExecutionContext): HttpRequest => {
  return convertExecutionContextToGqlContext(context).request as HttpRequest;
};

export const getResponseFromContext = (context: ExecutionContext): HttpResponse => {
  return convertExecutionContextToGqlContext(context).response as HttpResponse;
};

export const getJwtTokenFromAuthorizationHeader = (request: HttpRequest): string | undefined => {
  const authorization = tryGet(() => request.headers.authorization, '');
  return authorization?.replace(JWT_BEARER_REALM, '').trim();
};
