import { Construct } from 'constructs';
import type { oas31 } from 'openapi3-ts';
import type { Api } from './api.js';
import type { Schema } from './schema.js';

interface ParameterOptionsBase<TName extends string | number | symbol> {
  name: TName;
  in: 'query' | 'header' | 'path' | 'cookie';
  required: boolean;
  description?: string;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  allowReserved?: boolean;
  style?: 'simple';
}

interface ParameterOptions<TName extends string | number | symbol>
  extends ParameterOptionsBase<TName> {
  schema: Schema;
}

// interface ParameterOptions<TName extends string | number | symbol>
//   extends ParameterOptionsBase<TName> {
//   content: unknown;
// }

export class Parameter<
  TName extends string | number | symbol = '',
> extends Construct {
  private options: ParameterOptions<TName>;

  constructor(scope: Api, id: string, options: ParameterOptions<TName>) {
    super(scope, id);
    this.options = options;
  }

  public referenceObject(): oas31.ReferenceObject {
    return {
      $ref: this.jsonPointer(),
    };
  }

  public get schemaKey() {
    return this.node.id;
  }

  public jsonPointer(): string {
    return `#/components/parameters/${this.schemaKey}`;
  }

  public synth() {
    return {
      name: this.options.name.toString(),
      in: this.options.in,
      ...(this.options.description && {
        description: this.options.description,
      }),
      ...(this.options.allowReserved && {
        allowReserved: this.options.allowReserved,
      }),
      required: this.options.required,
      ...(this.options.allowEmptyValue && {
        allowEmptyValue: this.options.allowEmptyValue,
      }),
      ...(this.options.style && { style: this.options.style }),
      ...(this.options.schema && {
        schema: this.options.schema.referenceObject(),
      }),
    } satisfies oas31.ParameterObject | oas31.ReferenceObject;
  }
}
