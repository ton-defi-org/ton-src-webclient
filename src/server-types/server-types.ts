// Coupled with server
export type VerifyResult = {
  compileResult: CompileResult,
  sig?: string,
  ipfsLink?: string,
  msgCell?: Buffer
}

export type CompileResult = {
  result: "similar" | "not_similar" | "compile_error" | "unknown_error";
  error: string | null;
  hash: string | null;
  funcCmd: string | null;
};

export type CompileOptions = {
  compiler: "func";
  version: "0.0.9" | "0.1.0" | "0.2.0";
  compileCommandLine: string | null;
};

export type DBSource = CompileOptions & {
  sources: {
    codeLocationPointer: CodeLocationPointer;
    originalFilename: string;
    includeInCompile: boolean;
    isEntrypoint: boolean;
    isStdLib: boolean;
    hasIncludeDirectives: boolean;
  }[];
  knownContractAddress: string;
  verificationDate: number;
  hash: Hash;
};

export type ReturnedSource = CompileOptions & {
  sources: {
    url: URL;
    originalFilename: string;
    includeInCompile: boolean;
    isEntrypoint: boolean;
    isStdLib: boolean;
    hasIncludeDirectives: boolean;
  }[];
  knownContractAddress: string;
  verificationDate: number;
  hash: Hash;
};

type URL = string;
type Hash = string;
export type CodeLocationPointer = string;
