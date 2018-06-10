import { FlickrService } from "@flickr";
import { PhotosRouter } from "@api/routes";
import { ApiFactory } from "@api";
import { Router } from "express";
import { HttpRequest } from "@common";

export { ApiFactory } from "@api/factories";
export { PhotosRouter } from "@api/routes";
import request from "request";

export const createFlickrApi = (apiKey: string) => {
  const photosService = new FlickrService(apiKey, new HttpRequest(request));
  const router = Router();

  new PhotosRouter(photosService).use(router);
  return ApiFactory.create(router);
};