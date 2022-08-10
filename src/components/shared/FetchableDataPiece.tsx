import { DataPiece } from "./DataPiece";

export interface FetchablePiece<T> {
  data?: T;
  error?: string;
}

export function FetchableDataPiece({
  label,
  data,
}: {
  label: string;
  data: FetchablePiece<string>;
}) {
  return (
    <DataPiece
      label={label}
      data={data.data}
      error={data.error}
      loading={!data.data && !data.error}
    />
  );
}
