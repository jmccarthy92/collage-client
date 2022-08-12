export interface Message {
  url: string;
}

export interface Option {
  handler: (ur: string) => any;
}
