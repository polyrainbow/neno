interface ProgramArgumentInformationBase {
  type: "boolean" | "string" | "integer",
  short?: string,
  description: string,
  default: string | boolean | number,
}

interface ProgramArgumentInformationBoolean extends ProgramArgumentInformationBase {
  type: "boolean",
  default: boolean,
}

export interface ParseArgsOptionConfig {
  type: 'string' | 'boolean';
  short?: string;
  multiple?: boolean;
}

interface ProgramArgumentInformationString extends ProgramArgumentInformationBase {
  type: "string",
  default: string,
}

interface ProgramArgumentInformationInteger extends ProgramArgumentInformationBase {
  type: "integer",
  default: number,
}

export type ProgramArgumentInformation
  = ProgramArgumentInformationBoolean
  | ProgramArgumentInformationString
  | ProgramArgumentInformationInteger;

export interface ProgramArgumentsDescription {
  [key: string]: ProgramArgumentInformation,
}

export interface ProgramArguments {
  "data-folder-path": string,
  "session-secret": string,
  "session-ttl": number,
  "max-upload-file-size": number,
  "session-cookie-name": string,
  "max-graph-size": number,
  "cert-key-path": string,
  "cert-path": string,
  "use-https": boolean,
  "http-port": number,
  "https-port": number,
  "ipv6-only": boolean,
}

