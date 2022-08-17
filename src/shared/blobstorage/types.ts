export interface TransferProgressEvent {
  loadedBytes: number;
}

export interface AbortSignalLike {
  /**
   * Indicates if the signal has already been aborted.
   */
  readonly aborted: boolean;
  /**
   * Add new "abort" event listener, only support "abort" event.
   */
  addEventListener(
    type: "abort",
    listener: (this: AbortSignalLike, ev: any) => any,
    options?: any
  ): void;
  /**
   * Remove "abort" event listener, only support "abort" event.
   */
  removeEventListener(
    type: "abort",
    listener: (this: AbortSignalLike, ev: any) => any,
    options?: any
  ): void;
}

export interface Metadata {
  [propertyName: string]: string;
}

export interface Options {
  fileName?: string; // Optional file name
  metadata?: Metadata;
  onProgress?: (progress: TransferProgressEvent) => void;
  abortSignal?: AbortSignalLike;
  blobDirectory?: string;
}

export interface FileUploadOperation {
  file: File;
  options?: Options;
}
