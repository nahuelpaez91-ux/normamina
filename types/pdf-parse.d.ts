declare module "pdf-parse/lib/pdf-parse.js" {
  interface PDFData {
    text: string;
    numpages: number;
    info: unknown;
    metadata: unknown;
    version: string;
  }
  function pdf(dataBuffer: Buffer): Promise<PDFData>;
  export default pdf;
}
