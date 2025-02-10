import { Request, Response } from "express";
import { parseSkipAndLimit } from "../../../utils";
import { GLOBAL_API_LIMIT } from "../../../utils/constants";
import { db } from "../../../database";
import { useResponse } from "../../../utils/use-response";

type DbModel = 'User'

export const getAll = (model: DbModel) => {
  return async (req: Request, res: Response) => {
    const { skip, limit } = parseSkipAndLimit(req, GLOBAL_API_LIMIT)
    const { sort } = req.query

    let sortObject = {}

    if (sort && typeof sort === 'string') {
      const [field, order] = sort.split(',')
      sortObject = { [field]: order === 'asc' ? 1 : -1 }
    }
    
    try {
      const data = await db[model].find().skip(skip).limit(limit).sort(sortObject).lean()
      useResponse(res, 200, { items: data })
    } catch (error) {
      useResponse(res, 500, (error as Error).message)
    }
  }
}

export const count = (model: DbModel) => {
  return async (req: Request, res: Response) => {
    try {
      const count = await db[model].estimatedDocumentCount()
      useResponse(res, 200, { count })
    } catch (error) {
      useResponse(res, 500, (error as Error).message)
    }
  }
}

export const countAndGetAll = (model: DbModel) => {
  return async (req: Request, res: Response) => {
  const { skip, limit } = parseSkipAndLimit(req, GLOBAL_API_LIMIT)
  const { sort } = req.query

  let sortObject = {}

  if (sort && typeof sort === 'string') {
    const [field, order] = sort.split(',')
    sortObject = { [field]: order === 'asc' ? 1 : -1 }
  }
  
  try {
    const [data, count] = await Promise.all([
      db[model].find().skip(skip).limit(limit).sort(sortObject).lean(),
      db[model].estimatedDocumentCount()
    ])
    useResponse(res, 200, { items: data, count })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}
}

export const getById = (model: DbModel) => {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      useResponse(res, 400, 'Property ID is required')
      return
    }
    try {
      const data = await db[model].findById(id).lean()
      if (!data) {
        useResponse(res, 404, `${model} not found`)
        return
      }
      useResponse(res, 200, data)
    } catch (error) {
      useResponse(res, 500, (error as Error).message)
    }
  }
}

export const create = (model: DbModel) => {
  return async (req: Request, res: Response) => {
    const data = req.body;
    if (!data) {
      useResponse(res, 400, 'No data was provided')
      return
    }
    try {
      const item = new db[model](data)
      await item.save()
      useResponse(res, 200, { item })
    } catch (error) {
      useResponse(res, 500, (error as Error).message)
    }
  }
}

export const update = (model: DbModel) => {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body
    if (!id) {
      useResponse(res, 400, 'Property ID is required')
      return
    }
    if (!data) {
      useResponse(res, 400, 'No data was provided')
      return
    }
    delete data.createdAt
    delete data.updatedAt
    delete data.__v

    try {
      const item = await db[model].findByIdAndUpdate(id, data, { new: true })
      if (!item) {
        useResponse(res, 404, `${model} not found`)
        return
      }
      useResponse(res, 200, { message: `${model} updated`, item })
    } catch (error) {
      useResponse(res, 500, (error as Error).message)
    }
  }
}

export const updateSettings = async (req: Request, res: Response) => {
  const data = req.body
  if (!data) {
    useResponse(res, 400, 'No data was provided')
    return
  }
  delete data.createdAt
  delete data.updatedAt
  delete data.__v

  try {
    const settings = await db.Settings.findOneAndUpdate({}, data, { new: true })
    useResponse(res, 200, { settings })
    return
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}

export const deleteOne = (model: DbModel) => {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      useResponse(res, 400, 'Property ID is required')
      return
    }
    try {
      const property = await db[model].findByIdAndDelete(id)
      if (!property) {
        useResponse(res, 404, 'Property not found')
        return
      }
      useResponse(res, 200, 'Property deleted')
    } catch (error) {
      useResponse(res, 500, (error as Error).message)
    }
  }
}


export const deleteAll = (model: DbModel) => {
  return async (req: Request, res: Response) => {
    try {
      await db[model].deleteMany({});
      useResponse(res, 200, 'All properties deleted');
    } catch (error) {
      useResponse(res, 500, (error as Error).message);
    }
  }
}