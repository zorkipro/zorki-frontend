/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ResponseHandler } from "../ResponseHandler";

// Mock logger
vi.mock("@/utils/logger", () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ResponseHandler", () => {
  let responseHandler: ResponseHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    responseHandler = ResponseHandler.getInstance();
  });

  describe("getInstance", () => {
    it("should return singleton instance", () => {
      const instance1 = ResponseHandler.getInstance();
      const instance2 = ResponseHandler.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("parseResponse", () => {
    it("should handle 204 No Content", async () => {
      const response = new Response(null, {
        status: 204,
        headers: { "content-type": "application/json" },
      });

      const result = await responseHandler.parseResponse(response, "/test");

      expect(result.data).toBeUndefined();
      expect(result.hasError).toBe(false);
      expect(result.errorData).toBeUndefined();
    });

    it("should parse successful JSON response", async () => {
      const mockData = { id: 1, name: "Test" };
      const response = new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { "content-type": "application/json" },
      });

      const result = await responseHandler.parseResponse(response, "/test");

      expect(result.data).toEqual(mockData);
      expect(result.hasError).toBe(false);
    });

    it("should handle successful response without JSON", async () => {
      const response = new Response(null, {
        status: 200,
        headers: { "content-type": "text/plain" },
      });

      const result = await responseHandler.parseResponse(response, "/test");

      expect(result.data).toBeUndefined();
      expect(result.hasError).toBe(false);
    });

    it("should handle error response with JSON", async () => {
      const errorData = {
        message: "Not found",
        statusCode: 404,
        errorField: null,
      };
      const response = new Response(JSON.stringify(errorData), {
        status: 404,
        headers: { "content-type": "application/json" },
      });

      const result = await responseHandler.parseResponse(response, "/test");

      expect(result.data).toBeUndefined();
      expect(result.hasError).toBe(true);
      expect(result.errorData).toEqual(errorData);
    });

    it("should handle error response without JSON", async () => {
      const response = new Response(null, {
        status: 500,
        statusText: "Internal Server Error",
        headers: { "content-type": "text/plain" },
      });

      const result = await responseHandler.parseResponse(response, "/test");

      expect(result.data).toBeUndefined();
      expect(result.hasError).toBe(true);
      expect(result.errorData).toEqual({
        message: "Internal Server Error",
        statusCode: 500,
        errorField: null,
      });
    });

    it("should handle JSON parsing error for successful response", async () => {
      const response = new Response("invalid json", {
        status: 200,
        headers: { "content-type": "application/json" },
      });

      const result = await responseHandler.parseResponse(response, "/test");

      expect(result.data).toBeUndefined();
      expect(result.hasError).toBe(false);
    });

    it("should handle JSON parsing error for error response", async () => {
      const response = new Response("invalid json", {
        status: 400,
        headers: { "content-type": "application/json" },
      });

      const result = await responseHandler.parseResponse(response, "/test");

      expect(result.data).toBeUndefined();
      expect(result.hasError).toBe(true);
      expect(result.errorData).toEqual({
        message: "Failed to parse response",
        statusCode: 400,
        errorField: null,
      });
    });

    it("should provide detailed logging for 500 errors", async () => {
      const { logger } = await import("@/utils/logger");
      const errorData = {
        message: "Internal Server Error",
        statusCode: 500,
        errorField: null,
      };
      const response = new Response(JSON.stringify(errorData), {
        status: 500,
        headers: { "content-type": "application/json" },
      });

      await responseHandler.parseResponse(response, "/test");

      expect(logger.error).toHaveBeenCalledWith(
        "500 Error Details",
        expect.objectContaining({
          component: "ResponseHandler",
          responseBody: errorData,
          url: "/test",
        }),
      );
    });
  });

  describe("createErrorResponse", () => {
    it("should create error response object", () => {
      const errorResponse = responseHandler.createErrorResponse(
        "Test error",
        400,
      );

      expect(errorResponse).toEqual({
        message: "Test error",
        statusCode: 400,
        errorField: null,
      });
    });
  });
});
