import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // Handle GraphQL error format
    if (this.isGraphQLError(errorResponse)) {
      // Handle GraphQL errors in a specific way
      return this.handleGraphQLError(errorResponse, response, status, request);
    }

    // Handle REST/HTTP error format
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.extractErrorMessage(errorResponse),
    });
  }

  // Check if the error response is from GraphQL
  private isGraphQLError(errorResponse: any): boolean {
    return errorResponse && Array.isArray(errorResponse.errors);
  }

  // Handle GraphQL error format
  private handleGraphQLError(errorResponse: any, response: Response, status: number, request: Request) {
    // For GraphQL, we return an array of errors, which we can format accordingly
    const errorMessages = errorResponse.errors.map((error: GraphQLError) => ({
      message: error.message,
      path: error.path,
      locations: error.locations,
    }));

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors: errorMessages, // GraphQL errors
    });
  }

  // Extract the message from the error response (for REST or non-GraphQL errors)
  private extractErrorMessage(errorResponse: any): string {
    if (typeof errorResponse === 'string') {
      return errorResponse; // For general string error responses
    } else if (errorResponse && errorResponse.message) {
      return errorResponse.message; // For errors like validation failures
    } else {
      return 'Internal server error';
    }
  }
}
