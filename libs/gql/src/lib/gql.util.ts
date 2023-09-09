import { DocumentNode, OperationDefinitionNode, print } from 'graphql';
import { GqlRequestBody, Variables } from './gql.model';
import { HttpHeaders } from '@angular/common/http';

export const getOperationName = (doc: DocumentNode): string | null => {
  return (
    doc.definitions
      .filter(
        (definition) =>
          definition.kind === 'OperationDefinition' && definition.name
      )
      .map((x: OperationDefinitionNode) => x?.name?.value)[0] || null
  );
};

export const createGqlBody = <V = Variables>(
  doc: DocumentNode,
  variables?: V
): GqlRequestBody => {
  return {
    operationName: getOperationName(doc) as string,
    query: print(doc),
    variables,
  } as GqlRequestBody;
};

export const createGqlHeaders = (headers = {}): HttpHeaders => {
  let httpHeaders = new HttpHeaders();

  for (const key of Object.keys(headers)) {
    httpHeaders = httpHeaders.append(key, headers[key]);
  }

  return httpHeaders
    .set('Cache-Control', 'no-cache, no-store')
    .set('Pragma', 'no-cache')
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('Accept', 'application/json')
    .set('RequestFlavor', 'GQL');
};
