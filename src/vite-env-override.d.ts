declare module "*lines.csv" {
  interface Row {
    line_code: string;
    line_name: string;
    line_color: string;
  }
  const content: Row[];

  // noinspection JSUnusedGlobalSymbols
  export default content;
}

interface ImportMeta {
  env: {
    VITE_API_BASE_URL: string;
  };
}
