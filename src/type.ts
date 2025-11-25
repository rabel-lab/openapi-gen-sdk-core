export type OpenApiSource = {
  text: string;
  pathname: string;
  extension: string;
};

export type OpenApiPackageInfo = {
  source: string;
  version: string;
  syncVersion?: boolean;
};

export type PackageJson = {
  version: string;
  openapi: OpenApiPackageInfo;
  [key: string]: string | number | boolean | Object;
};
