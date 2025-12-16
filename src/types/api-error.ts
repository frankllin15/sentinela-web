/* eslint-disable @typescript-eslint/no-explicit-any */
// types/api-error.ts (ou no mesmo arquivo do axios)

import { type ErrorResponseDto } from "./error-response";

export class ApiError extends Error {
  statusCode: number;
  errorCode: string;
  isUserFacing: boolean;
  details?: any;
  originalError: any;

  constructor(dto: ErrorResponseDto, originalError?: any) {
    // Se a mensagem for array, junta, senão usa a string direta
    const messageString = Array.isArray(dto.message)
      ? dto.message.join(", ")
      : dto.message;

    super(messageString);
    this.name = "ApiError";
    this.statusCode = dto.statusCode;
    this.errorCode = dto.errorCode;
    this.isUserFacing = dto.isUserFacing;
    this.details = dto.details;
    this.originalError = originalError;
  }
}
