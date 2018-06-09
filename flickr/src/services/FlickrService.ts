import {
  IRequest,
  IPagination,
  IPhotoPagination,
  IFlickrPaginationResponse,
  IFlickrFilter,
  IPhoto,
  IPhotoFeatures,
} from "contracts";

export class FlickrService {

  private readonly baseURL: string = "https://api.flickr.com/services/rest";

  constructor(private apiKey: string, private request: IRequest) {
  }

  async getAllImagesAsync(filter: IPagination): Promise<IPhotoPagination> {
    const response = await this.request.getAsync<IFlickrPaginationResponse>(this.baseURL, {
      qs: this.createFlickrFilter(filter),
    });

    return {
      total: response.total,
      totalPages: response.pages,
      photos: response.photo.filter(x => !!x).map(x => ({
        description: (x.description && x.description).__content || "",
        id: x.id,
        urls: {
          large: this.toPhotoFeatures(x.url_l, x.width_l, x.height_l),
          medium: this.toPhotoFeatures(x.url_m, x.width_m, x.height_m),
          small: this.toPhotoFeatures(x.url_s, x.width_s, x.height_s),
        },
      })),
    };
  }

  private createFlickrFilter(filter: IPagination): IFlickrFilter {
    return {
      api_key: this.apiKey,
      content_type: 7,
      extras: "description,rotation,url_c,url_l,url_m,url_n,url_q,url_s,url_sq,url_t,url_z",
      format: "json",
      lang: "en-US",
      method: "flickr.photos.search",
      sort: "relevance",
      nojsoncallback: 1,
      page: filter.page,
      per_page: filter.itemsPerPage,
    };
  }

  private toPhotoFeatures(
    url: string = "",
    width: string = "",
    height: string = ""): IPhotoFeatures {
    return {
      url,
      width: parseInt(width, undefined) || 0,
      height: parseInt(height, undefined) || 0,
    };
  }
}