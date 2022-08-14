import { DataPiece } from "./DataPiece";

export interface FetchablePiece<T> {
  data?: T;
  error?: string;
}

export function FetchableDataPiece({
  label,
  data,
  format,
}: {
  label: string;
  data: FetchablePiece<string>;
  format?: (data: string) => string;
}) {
  return (
    <DataPiece
      label={label}
      data={data.data}
      error={data.error}
      loading={!data.data && !data.error}
      format={format}
    />
  );
}
