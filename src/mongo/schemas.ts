import { map } from 'lodash'
import { Schema, SchemaOptions, SchemaTypeOpts } from 'mongoose'

import { AppSchema, ResponseSchema, IncidentSchema } from '../schema'

export enum CollectionName {
  APP = 'app',
  RESPONSE = 'response',
  INCIDENT = 'incident',
}

type required<T> = {
  [K in keyof T] - ?: T[K]
}

type SchemaDefinition<T> = {
  [K in keyof required<T>]: SchemaTypeOpts<any>
}

export function createAppSchema () {
  const defination: SchemaDefinition<AppSchema> = {
    _id: Schema.Types.ObjectId,
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      required: true,
    },
    frequency: {
      type: Number,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    method: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    headers: {
      type: map,
      of: String,
    },
    body: {
      type: map,
      of: String,
    }
  }
  const options: SchemaOptions = {
    read: 'secondaryPreferred',
  }
  return new Schema(defination, options)
}

export function createResponseSchema () {
  const defination: SchemaDefinition<ResponseSchema> = {
    _id: Schema.Types.ObjectId,
    appId: Schema.Types.ObjectId,
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
    startTime: {
      type: Date,
    },
    records: [recordSchema],
  }
  const options: SchemaOptions = {
    read: 'secondaryPreferred',
  }

  return new Schema(defination, options)
}

const recordSchema = new Schema({
  rt: {
    type: Number
  },
  time: {
    type: Date,
    default: Date.now,
  },
  statusCode: {
    type: Number,
    default: 200,
  },
  ifError: {
    type: Boolean,
    default: false
  }
})

export function createIncidentSchema () {
  const defination: SchemaDefinition<IncidentSchema> = {
    _id: Schema.Types.ObjectId,
    appId: Schema.Types.ObjectId,
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number,
    },
    inError: {
      type: Boolean,
      default: true,
    }
  }
  const options: SchemaOptions = {
    read: 'secondaryPreferred',
  }

  return new Schema(defination, options)
}
