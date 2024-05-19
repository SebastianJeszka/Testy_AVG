export class FileUploadResponse {
  constructor(public businessId: string, public name: string, public size: number, public url: string) {}
}

export class FileUploadData {
  constructor(public fileName: string, public content: string, public contentType: string) {}
}
