import { Type } from '@sinclair/typebox';
import { InternalServerError } from 'src/framework/errors/error-factory';
import { getSafeValue, setDefaultsOnStaticSchema } from 'src/framework/utils';

describe('Utils.ts', () => {
  describe('getSafeValue', () => {
    it('should return data from object if everything exists', () => {
      const result = getSafeValue({ a: 'test' }, 'a');
      expect(result).toStrictEqual('test');
    });

    it('should return undefined if key does not exist', () => {
      //@ts-expect-error: test case
      const result = getSafeValue({ a: 'test' }, 'b');
      expect(result).toBeUndefined();
    });

    it('should return undefined if object is undefined', () => {
      //@ts-expect-error: test case
      const result = getSafeValue(undefined, 'b');
      expect(result).toBeUndefined();
    });

    it('throws an error if used with a forbidden key', () => {
      const result = (): void => {
        //@ts-expect-error: test case
        getSafeValue({ a: 'test' }, '__proto__');
      };

      expect(result).toThrow(InternalServerError);
    });
  });

  describe('setDefaultsOnStaticSchema', () => {
    it('should set default attributes on static schema', () => {
      const UserSchema = Type.Object({
        name: Type.String({
          description: 'name description',
        }),
        mail: Type.Optional(Type.String({ format: 'email' })),
        age: Type.Optional(Type.Number({ default: 10 })),
        secondValue: Type.Optional(Type.Number({ default: 10 })),
        thirdValue: Type.Optional(Type.Number({ default: 10 })),
      });

      const type = setDefaultsOnStaticSchema(UserSchema, ['age', 'secondValue']);

      const verifiedUserSchema = Type.Object({
        name: Type.String({
          description: 'name description',
        }),
        mail: Type.Optional(Type.String({ format: 'email' })),
        age: Type.Number({ default: 10 }),
        secondValue: Type.Number({ default: 10 }),
        thirdValue: Type.Optional(Type.Number({ default: 10 })),
      });

      expect(verifiedUserSchema.static).toStrictEqual(type.static);
    });
  });
});
