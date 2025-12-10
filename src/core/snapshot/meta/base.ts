import { Info } from '@/core/extracter/info/type';
import { SnapshotConfig, SnapshotFileExtension } from '@/core/snapshot/config';
import { buildMetaFile, buildMetaPath, buildMetaSourceFiles } from '@/core/snapshot/meta/lib/build';
import { compareSha256, digestString, Sha256String } from '@/core/snapshot/meta/lib/compare';
import { OpenApiSource } from '@/utils';

import { readFileSync, writeFileSync } from 'fs';
import { join as pathJoin } from 'path';

export type SnapshotMetaFiles = {
  names: {
    source: string;
    normalized: string;
  };
  extensions: {
    source: SnapshotFileExtension;
    normalized: SnapshotFileExtension;
  };
};
export type SnapshoMetaExtension = {
  source: SnapshotFileExtension;
  normalized: SnapshotFileExtension;
};
export type SnapshotMetaSignatures = {
  source: Promise<Sha256String> | null;
  normalized: Promise<Sha256String> | null;
  meta: Promise<Sha256String> | null;
};

type SnapshotMetaData = {
  info: Info;
  path: string;
  config: Required<SnapshotConfig>;
  files: SnapshotMetaFiles;
  sha256: SnapshotMetaSignatures;
};

class SnapshotMetaImpl {
  info: Info;
  path: string;
  config: Required<SnapshotConfig>;
  files: SnapshotMetaFiles;
  sha256: SnapshotMetaSignatures;
  constructor(data: SnapshotMetaData) {
    this.info = data.info;
    this.path = data.path;
    this.config = data.config;
    this.files = data.files;
    this.sha256 = data.sha256;
  }
}

type SnapshotMetaConstructor_Clone = {
  meta: SnapshotMetaData;
};

type SnapshotMetaConstructor_New = {
  openapiSource: OpenApiSource;
  config: Required<SnapshotConfig>;
};

type SnapshotMetaConstructor = SnapshotMetaConstructor_Clone | SnapshotMetaConstructor_New;

export class SnapshotMeta extends SnapshotMetaImpl {
  constructor(args: SnapshotMetaConstructor_Clone);
  constructor(args: SnapshotMetaConstructor_New);
  constructor(args: SnapshotMetaConstructor) {
    if ('meta' in args) {
      super(args.meta);
      return;
    } else if ('openapiSource' in args && 'config' in args) {
      const { openapiSource, config } = args;
      super({
        info: openapiSource.info,
        path: buildMetaPath(config, openapiSource.info.version),
        files: buildMetaSourceFiles(config, openapiSource),
        config,
        sha256: {
          source: Promise.resolve(''),
          normalized: Promise.resolve(''),
          meta: Promise.resolve(''),
        },
      });
    }
  }

  static find(version: string, config: Required<SnapshotConfig>): SnapshotMeta {
    const path = buildMetaPath(config, version);
    const metaFile = buildMetaFile();
    const pathTo = pathJoin(path, metaFile.file);
    const text = readFileSync(pathTo);
    try {
      const meta = JSON.parse(text.toString()) as SnapshotMetaData;
      return new SnapshotMeta({ meta });
    } catch {
      throw new Error('Snapshot: failed to load meta');
    }
  }

  static pull(info: Info, config: Required<SnapshotConfig>): SnapshotMeta {
    const path = buildMetaPath(config, info.version);
    const metaFile = buildMetaFile();
    const pathTo = pathJoin(path, metaFile.file);
    const text = readFileSync(pathTo);
    try {
      const pulledMeta = JSON.parse(text.toString()) as SnapshotMetaData;
      //... clone
      return new SnapshotMeta({ meta: pulledMeta });
    } catch {
      throw new Error('Snapshot: failed to load meta');
    }
  }

  //-> Public
  /**
   * Save the meta to the snapshot path.
   * @returns - true if saved, false if failed
   */
  async push() {
    const metaFile = buildMetaFile();
    const pathTo = pathJoin(this.path, metaFile.file);
    const text = JSON.stringify(this, null, 2);
    try {
      writeFileSync(pathTo, text);
      this.digest({
        meta: text,
      });
      return true;
    } catch {
      throw new Error('Snapshot: failed to save meta');
    }
  }

  /**
   * Lock a file to the meta via sha256 digest.
   * @param target - Specific target to sync.
   * @returns - true if saved, false if failed
   * @default - sync all
   */
  async digest(digester: {
    [key in keyof SnapshotMetaSignatures]?: string;
  }) {
    //-> hash all
    Object.entries(digester).map(async ([key, value]) => {
      const digest = digestString(value);
      this.sha256[key as keyof SnapshotMetaSignatures] = digest;
    });
  }
  /**
   * Compare the meta to another meta.
   * @param other - The other meta.
   * @returns - true if identical, false if not
   */
  async compare(other: SnapshotMeta): Promise<boolean> {
    //# Check if same as other
    const sha256Compares = Object.entries(this.sha256).map(([indexKey, indexValue]) => {
      const otherValue = other.sha256[indexKey as keyof SnapshotMetaSignatures];
      const identical = Boolean(indexValue) === Boolean(otherValue);
      if (identical && indexValue && otherValue) {
        //Is: Identical && not null
        //-> trigger comparison
        return compareSha256([indexValue, otherValue]);
      } else {
        //Is: Not identical(false) : Identical && null(true)
        return identical;
      }
    });
    const matches = [
      //# Version & path
      this.path === other.path,
      this.info.version === other.info.version,
      //# sha256
      await Promise.race(sha256Compares),
    ];
    return matches.every((match) => match === true);
  }
}
