import { useRecoilState } from "recoil";
import { UploadedFile, fileRecoil } from "./store";

// TODO how/whether to support folders

export function useFileState() {
  const _sortFiles = (f1: UploadedFile, f2: UploadedFile) => {
    if (f1.isStdlib) return -1;
    if (f2.isStdlib) return 1;
    if (f1.isEntrypoint) return 1;
    if (f2.isEntrypoint) return -1;
    else return 0;
  };

  const [fileState, setFileState] = useRecoilState(fileRecoil);

  const addFiles = async (files: File[]) => {
    const newFiles = (
      await Promise.all(
        files
          .filter(
            (newFile) =>
              !fileState.uploadedFiles.some(
                (existingFile) => existingFile.file.name === newFile.name
              ) && newFile.name.match(/.*\.fc/)
          )
          .map(async (f): Promise<UploadedFile> => {
            const content = await f.text();
            return {
              file: f,
              content,
              hasIncludeDirectives: content.includes("#include"),
              isEntrypoint: /recv_(internal|external)\(/.test(content),
              isStdlib: f.name.toLowerCase() === "stdlib.fc",
              includeInCompile: !fileState.hasFilesNotIncludedInCompile,
            };
          })
      )
    ).sort(_sortFiles);

    setFileState((s) => ({
      ...s,
      uploadedFiles: [...newFiles, ...s.uploadedFiles].sort(_sortFiles),
    }));
  };

  const removeFile = (name: string) => {
    setFileState((s) => ({
      ...s,
      uploadedFiles: s.uploadedFiles.filter((f) => f.file.name !== name),
    }));
  };

  const sortFiles = (_names: { id: string }[]) => {
    const names = _names.map((n) => n.id);

    setFileState((s) => ({
      ...s,
      uploadedFiles: s.uploadedFiles
        .slice()
        .sort(
          (s1, s2) => names.indexOf(s1.file.name) - names.indexOf(s2.file.name)
        )
        .sort(_sortFiles),
    }));
  };

  const move = (name: string, fwd: boolean) => {
    setFileState((s) => {
      const fileIndex = s.uploadedFiles.findIndex((f) => f.file.name === name);
      const newArr = s.uploadedFiles.filter((f) => f.file.name !== name);

      if (fwd) {
        newArr.splice(
          Math.min(s.uploadedFiles.length - 1, fileIndex + 1),
          0,
          s.uploadedFiles[fileIndex]
        );
      } else {
        newArr.splice(
          Math.max(0, fileIndex - 1),
          0,
          s.uploadedFiles[fileIndex]
        );
      }

      return {
        ...s,
        uploadedFiles: newArr.sort(_sortFiles),
      };
    });
  };

  const markIncludeInCompile = (file: string, include: boolean) => {
    setFileState((s) => {
      return {
        ...s,
        uploadedFiles: s.uploadedFiles.map((f) => {
          if (f.file.name === file) {
            return {
              ...f,
              includeInCompile: include,
            };
          }
          return f;
        }),
      };
    });
  };

  // TODO remove sortFiles?
  return {
    fileState,
    removeFile,
    addFiles,
    sortFiles,
    markIncludeInCompile,
    move,
  };
}
