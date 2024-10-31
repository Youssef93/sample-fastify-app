import { TObject, TProperties, Type } from '@sinclair/typebox';

import { AppError } from './errors/error-factory';

export const isLocalEnv = (): boolean =>
  !process.env.NODE_ENV || ['local', 'test'].includes(process.env['NODE_ENV'] as string);

const forbiddenKeys = ['__proto__', 'constructor', 'prototype'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSafeValue<T, R = any>(obj: T, key: keyof T): R {
  if (!obj) return undefined as R;

  if (forbiddenKeys.includes(key.toString()))
    throw new AppError(500, `Cannot get key ${key.toString()} as it is a forbidden value`);

  // eslint-disable-next-line security/detect-object-injection
  return obj[key] as R;
}

/**
 * Utility function to mark multiple attributes as required in a TypeBox schema.
 *
 * @param schema - The original schema to modify.
 * @param requiredKeys - An array of keys to mark as non-optional.
 * @returns - A new intersected schema with the selected attributes required.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function setDefaultsOnStaticSchema<S extends TObject<TProperties>, K extends keyof S['properties'] & string>(
  schema: S,
  requiredKeys: K[],
) {
  // Omit the keys from the original schema
  const omittedSchema = Type.Omit(schema, requiredKeys);

  // Create a new object schema with all the required keys
  const requiredSchema = Type.Required(
    Type.Object(
      requiredKeys.reduce(
        (acc, key) => {
          // eslint-disable-next-line security/detect-object-injection
          acc[key] = getSafeValue(schema.properties, key);
          return acc;
        },
        {} as Pick<S['properties'], K>,
      ),
    ),
  );

  // Return the intersected schema
  return Type.Intersect([omittedSchema, requiredSchema]);
}
