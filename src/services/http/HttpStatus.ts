export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  MultipleChoices = 300,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

export const isSuccessStatus = (status: number): boolean => {
  return status >= Number(HttpStatus.Ok) && status < Number(HttpStatus.MultipleChoices);
};
