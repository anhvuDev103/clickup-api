export enum TokenType {
  RefreshToken,
  AccessToken,
  ForgotPasswordToken,
}

export enum HttpStatus {
  Ok = 200,
  Created = 201,

  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  UnprocessableEntity = 422,

  InternalServerError = 500,
}

export enum ProjectHierarchyLevel {
  Category,
  SubCategory,
}

export enum TaskPriority {
  None = 'none',
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Urgent = 'urgent',
}

export enum TaskStatus {
  Todo = 'to do',
  InProgress = 'in progress',
  Complete = 'complete',
}
