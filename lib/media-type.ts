import { Construct } from 'constructs';
import type { OpenAPIV3 } from 'openapi-types';
import { Reference } from './reference.js';
import type { Schema } from './schema.js';

export interface MediaTypeOptions {
  contentType:
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
    | 'application/json'
    | 'image/*';
  schema: Schema | Reference<Schema>;
}

export class MediaType extends Construct {
  private options: MediaTypeOptions;

  public get contentType() {
    return this.options.contentType;
  }

  constructor(scope: Construct, id: string, options: MediaTypeOptions) {
    super(scope, id);
    this.options = options;
  }

  public synth(): OpenAPIV3.MediaTypeObject {
    return {
      schema:
        this.options.schema instanceof Reference
          ? this.options.schema.synth()
          : this.options.schema.referenceObject(),
    };
  }
}
