export type AssetType = 'style' | 'script';

export interface AssetsInterface {
  url?: string;
  content?: string;
  type: AssetType;
  shortName?: string;
}
