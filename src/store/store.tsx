import { atom, RecoilState, selector, useRecoilState } from "recoil";
import { FetchablePiece } from "../components/shared/FetchableDataPiece";
import { ReturnedSource, VerifyResult } from "../server-types/server-types";

const fileTypes = ["fc"];

/* TODO 

-  Inspection of the files? i.e. if import is used

*/

export type UploadedFile = {
  file: File;
  isEntrypoint: boolean;
  hasIncludeDirectives: boolean;
  content: string;
  isStdlib: boolean;
  includeInCompile: boolean;
};

export const fileRecoil = generateRecoil(
  { uploadedFiles: [] as UploadedFile[] },
  (s) => {
    const warnings = [];

    if (!s.uploadedFiles.some((f) => f.isEntrypoint)) {
      warnings.push("Missing entry point file");
    }
    if (s.uploadedFiles.filter((f) => f.isEntrypoint).length > 1) {
      warnings.push("There cannot be more than one entry point files");
    }

    if (!s.uploadedFiles.some((f) => f.isStdlib)) {
      warnings.push("Missing stdlib.fc");
    }

    return {
      hasFiles: s.uploadedFiles?.length > 0,
      fileNames: () =>
        s.uploadedFiles.map((f) => ({ id: f.file.name, item: f })),
      warnings,
      hasFilesNotIncludedInCompile: s.uploadedFiles.some(
        (f) => !f.includeInCompile
      ),
      hasFilesWithIncludeDirectives: s.uploadedFiles.some(
        (f) => f.hasIncludeDirectives
      ),
    };
  }
);

export const compileRecoil = generateRecoil<
  Partial<VerifyResult & { isLoading: boolean }>,
  {}
>({ isLoading: false }, () => ({}));

export const compilerDetailsRecoil = generateRecoil(
  {
    compiler: "func" as "func",
    version: "0.2.0" as "0.0.9" | "0.1.0" | "0.2.0",
    compileCommandLine: "",
  },
  () => ({})
);

export function useRecoilStateMerger<T>(
  recoil: RecoilState<T>
): [T, (updated: Partial<T>) => void] {
  const [data, setData] = useRecoilState(recoil);

  const setProp = (obj: any) => {
    setData((s) => ({ ...s, ...obj }));
  };

  return [data, setProp];
}

export function generateRecoil<T, C>(
  defaultVal: T,
  selectorObjFunc: (currentVal: T) => C
) {
  const _atom = atom<T>({
    key: `${Math.random()}`,
    default: defaultVal,
  });
  const _selector = selector({
    key: `${Math.random()}`,
    get: ({ get }) => {
      const _state = get(_atom);
      return { ..._state, ...selectorObjFunc(_state) };
    },
    set: ({ set, get }, newVal) => {
      set(_atom, newVal);
    },
  });

  return _selector;
}

export const contractStateRecoil = generateRecoil<
  {
    hash: FetchablePiece<string>;
    source: FetchablePiece<ReturnedSource | null>;
  },
  {}
>({ hash: {}, source: {} }, (s) => ({}));
