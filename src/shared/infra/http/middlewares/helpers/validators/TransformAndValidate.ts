import { AppError } from "@shared/errors/AppError";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

// Overload for when input is a single object
export async function validateAndTransformData<T extends object>(
  dtoClass: new () => T,
  data: T
): Promise<T>;

// Overload for when input is an array of objects
export async function validateAndTransformData<T extends object>(
  dtoClass: new () => T,
  data: T[]
): Promise<T[]>;

// Implementation of the function
export async function validateAndTransformData<T extends object>(
  dtoClass: new () => T,
  data: T | T[]
): Promise<T | T[]> {
  // Check if data is an array
  if (Array.isArray(data)) {
    // If data is an array, transform each element
    const transformedArray = data.map((item) => plainToClass(dtoClass, item));

    // Validate each transformed object in the array
    const validationPromises = transformedArray.map(async (item) => {
      const errors: ValidationError[] = await validate(item);
      if (errors.length > 0) {
        // Handle validation errors for individual items (e.g., log or throw an exception)
        //if node env is not test, console.error
        if (process.env.NODE_ENV !== "test") {
          console.error("Validation failed for item:", item, "Errors:", errors);
        }
        throw new AppError(
          `Validation failed: ${errors
            .map((err) => err.constraints)
            .map((val) => Object.values(val))
            .toString()}`
        );
      }
    });

    // Wait for all validation promises to resolve
    await Promise.all(validationPromises);

    return transformedArray;
  } else {
    // If data is not an array, transform a single object
    const dtoInstance = plainToClass(dtoClass, data);

    // Validate the transformed object
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      // Handle validation errors (e.g., log or throw an exception)
      if (process.env.NODE_ENV !== "test") {
        console.error("Validation failed:", errors);
      }
      throw new AppError(
        `Validation failed: ${errors
          .map((err) => err.constraints)
          .map((val) => Object.values(val))
          .toString()}`
      );
    }

    return dtoInstance;
  }
}
