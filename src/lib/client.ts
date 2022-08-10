import base64url from "base64url";
import { contractAddress } from "ton";
import { CompileOptions, ReturnedSource, VerifyResult } from '../server-types/server-types';
import { UploadedFile } from "../store/store";

function jsonToBlob(json: Record<string, any>): Blob {
  return new Blob([JSON.stringify(json)], { type: "application/json" });
}

class Client {
  // TODO payload type
  async tryCompile(
    hash: string,
    uploadedFiles: UploadedFile[],
    contractAddress: string,
    compileOptions: CompileOptions
  ): Promise<Partial<VerifyResult>> {
    const formData = new FormData();

    for (const f of uploadedFiles) {
      formData.append(f.file.name, f.file);
    }

    formData.append(
      "json",
      jsonToBlob({
        compiler: compileOptions.compiler,
        version: compileOptions.version,
        compileCommandLine: compileOptions.compileCommandLine,
        knownContractAddress: contractAddress,
        knownContractHash: hash,
        sources: uploadedFiles.map((u) => ({
          includeInCompile: u.includeInCompile,
          isEntrypoint: u.isEntrypoint,
          isStdLib: u.isStdlib,
          hasIncludeDirectives: u.hasIncludeDirectives,
        })),
      })
    );

    const response = await fetch(`http://localhost:3003/source`, {
      method: "POST",
      body: formData,
    });

    const json = await response.json();

    return json;
  }

  async get(hash: string): Promise<ReturnedSource | undefined> {
    const res = await fetch(
      `http://localhost:3003/source/${base64url.fromBase64(hash)}`
    );
    if (res.status === 404) return undefined;
    return res.json();
  }
}

export const client = new Client();
