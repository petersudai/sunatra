import type {
  Track,
  Photo,
  FavoriteTrack,
  ColorPalette,
  TrackType,
  Platform,
  FavPlatform,
} from "@/generated/prisma";

export type ITrack = Track;
export type IPhoto = Photo;
export type IFavoriteTrack = FavoriteTrack;
export type IColorPalette = ColorPalette & { colors: IColorSwatch[] };

export interface IColorSwatch {
  hex: string;
  name?: string;
}

export type { TrackType, Platform, FavPlatform };
