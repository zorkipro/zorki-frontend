/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { APIError } from '../ApiErrorHandler';
import type { BadRequestExceptionDto } from '../types';

describe('APIError', () => {
  describe('constructor', () => {
    it('should create APIError with all properties', () => {
      const errorData: BadRequestExceptionDto = {
        message: 'Test error',
        statusCode: 400,
        errorField: [
          {
            field: 'email',
            message: 'Invalid email',
            errorKey: 'invalid_email',
          },
        ],
      };

      const error = new APIError(errorData);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.name).toBe('APIError');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.errorField).toEqual(errorData.errorField);
    });

    it('should create APIError without errorField', () => {
      const errorData: BadRequestExceptionDto = {
        message: 'Server error',
        statusCode: 500,
        errorField: null,
      };

      const error = new APIError(errorData);

      expect(error.statusCode).toBe(500);
      expect(error.errorField).toBeNull();
    });
  });

  describe('isValidationError', () => {
    it('should return true for 400 error with errorField', () => {
      const error = new APIError({
        message: 'Validation failed',
        statusCode: 400,
        errorField: [{ field: 'name', message: 'Required', errorKey: 'required' }],
      });

      expect(error.isValidationError()).toBe(true);
    });

    it('should return false for 400 error without errorField', () => {
      const error = new APIError({
        message: 'Bad request',
        statusCode: 400,
        errorField: null,
      });

      expect(error.isValidationError()).toBe(false);
    });

    it('should return false for non-400 error', () => {
      const error = new APIError({
        message: 'Server error',
        statusCode: 500,
        errorField: null,
      });

      expect(error.isValidationError()).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('should return true for 401 error', () => {
      const error = new APIError({
        message: 'Unauthorized',
        statusCode: 401,
        errorField: null,
      });

      expect(error.isAuthError()).toBe(true);
    });

    it('should return false for non-401 error', () => {
      const error = new APIError({
        message: 'Forbidden',
        statusCode: 403,
        errorField: null,
      });

      expect(error.isAuthError()).toBe(false);
    });
  });

  describe('isForbiddenError', () => {
    it('should return true for 403 error', () => {
      const error = new APIError({
        message: 'Forbidden',
        statusCode: 403,
        errorField: null,
      });

      expect(error.isForbiddenError()).toBe(true);
    });

    it('should return false for non-403 error', () => {
      const error = new APIError({
        message: 'Unauthorized',
        statusCode: 401,
        errorField: null,
      });

      expect(error.isForbiddenError()).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for 500 error', () => {
      const error = new APIError({
        message: 'Internal Server Error',
        statusCode: 500,
        errorField: null,
      });

      expect(error.isServerError()).toBe(true);
    });

    it('should return true for 503 error', () => {
      const error = new APIError({
        message: 'Service Unavailable',
        statusCode: 503,
        errorField: null,
      });

      expect(error.isServerError()).toBe(true);
    });

    it('should return false for 400 error', () => {
      const error = new APIError({
        message: 'Bad Request',
        statusCode: 400,
        errorField: null,
      });

      expect(error.isServerError()).toBe(false);
    });
  });

  describe('getValidationErrors', () => {
    it('should return Record of field errors', () => {
      const error = new APIError({
        message: 'Validation failed',
        statusCode: 400,
        errorField: [
          { field: 'email', message: 'Invalid email', errorKey: 'invalid_email' },
          { field: 'password', message: 'Too short', errorKey: 'min_length' },
        ],
      });

      const validationErrors = error.getValidationErrors();

      expect(validationErrors).toEqual({
        email: 'Invalid email',
        password: 'Too short',
      });
    });

    it('should return empty object when no errorField', () => {
      const error = new APIError({
        message: 'Error',
        statusCode: 500,
        errorField: null,
      });

      const validationErrors = error.getValidationErrors();

      expect(validationErrors).toEqual({});
    });

    it('should return empty object when errorField is empty array', () => {
      const error = new APIError({
        message: 'Error',
        statusCode: 400,
        errorField: [],
      });

      const validationErrors = error.getValidationErrors();

      expect(validationErrors).toEqual({});
    });
  });
});
