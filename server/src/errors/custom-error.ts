class CustomAPIError extends Error {
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode

    // Set the prototype explicitly (สำหรับการสืบทอด class Error ใน TypeScript)
    Object.setPrototypeOf(this, CustomAPIError.prototype)
  }
}

const createCustomError = (msg: string, statusCode: number): CustomAPIError => {
  return new CustomAPIError(msg, statusCode)
}

export { createCustomError, CustomAPIError }
