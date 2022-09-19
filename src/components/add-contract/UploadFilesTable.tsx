import {
  Col,
  Text,
  Row,
  Table,
  User,
  Tooltip,
  Container,
  Switch,
  Checkbox,
} from "@nextui-org/react";
import { Key, useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { UploadedFile } from "../../store/store";
import { useFileState } from "../../store/useFileState";
import { DeleteIcon } from "../icons/DeleteIcon";
import { generateRecoil } from "../../store/store";
import { useRecoilState, useRecoilValue } from "recoil";
import { DownCaretIcon } from "../icons/DownCaretIcon";
import { UpCaretIcon } from "../icons/UpCaretIcon";

const hoverRecoil = generateRecoil<{ hovered: string | null }, {}>(
  { hovered: null },
  () => ({})
);

// @ts-ignore
function ReorderableFilename({ filename }) {
  const hover = useRecoilValue(hoverRecoil);

  const { move, removeFile } = useFileState();

  return (
    <Row
      justify="center"
      align="center"
      css={{
        visibility: hover.hovered === filename ? "inherit" : "hidden",
      }}
    >
      <Col
        onClick={() => {
          move(filename, false);
        }}
      >
        <UpCaretIcon size={20} fill="#FF0080" style={{ cursor: "pointer" }} />
      </Col>
      <Col
        onClick={() => {
          move(filename, true);
        }}
      >
        <DownCaretIcon size={20} fill="#FF0080" style={{ cursor: "pointer" }} />
      </Col>
      <Col
        onClick={() => {
          removeFile(filename);
        }}
      >
        <DeleteIcon size={20} fill="#FF0080" style={{ cursor: "pointer" }} />
      </Col>
    </Row>
  );
}

export function UploadFilesTable() {
  const columns = [
    { name: "REORDER", uid: "actions" },
    { name: "FILE", uid: "file" },
    { name: "ENTRYPOINT", uid: "isEntrypoint" },
    { name: "INCLUDE IN COMPILATION", uid: "includeInCompile" },
  ];

  const { fileState, markIncludeInCompile } = useFileState();

  const renderCell = (item: UploadedFile, columnKey: Key) => {
    switch (columnKey) {
      case "actions":
        return <ReorderableFilename filename={item.file.name} />;
      case "file":
        return (
          <Col>
            <Row>
              <Text b>{item.file.name}</Text>
            </Row>
            <Row>
              <Text b size={14} css={{ color: "$accents7" }}>
                {item.file.size} bytes
              </Text>
            </Row>
          </Col>
        );
      case "isEntrypoint":
        return item.isEntrypoint ? (
          <Checkbox isDisabled isSelected={item.isEntrypoint} />
        ) : (
          <></>
        );
      case "includeInCompile":
        return (
          <Switch
            aria-label="Include in compile"
            disabled={!fileState.hasFilesWithIncludeDirectives}
            checked={item.includeInCompile}
            onChange={() => {
              markIncludeInCompile(item.file.name, !item.includeInCompile);
            }}
            size="xs"
          />
        );
      default:
        throw new Error("Unknown col:" + columnKey);
    }
  };

  const [hover, setHover] = useRecoilState(hoverRecoil);

  return (
    <Table
      css={{
        height: "auto",
        minWidth: "100%",
      }}
      shadow={false}
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            key={column.uid}
            hideHeader={column.uid === "actions"}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body
        items={fileState.uploadedFiles.map((k) => ({ ...k, key: k.file.name }))}
      >
        {(item) => {
          return (
            <Table.Row>
              {(columnKey) => {
                return (
                  // @ts-ignore
                  <Table.Cell
                    css={{
                      width: columnKey === "actions" ? 120 : "inherit",
                    }}
                  >
                    <div
                      onMouseOver={() => setHover({ hovered: item.key })}
                      onMouseOut={() => setHover({ hovered: null })}
                    >
                      {renderCell(item, columnKey)}
                    </div>
                  </Table.Cell>
                );
              }}
            </Table.Row>
          );
        }}
      </Table.Body>
    </Table>
  );
}
