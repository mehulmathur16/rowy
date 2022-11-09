import type { IEditorCellProps } from "@src/components/fields/types";
import { useSaveOnUnmount } from "@src/hooks/useSaveOnUnmount";

import { InputBase, InputBaseProps } from "@mui/material";

import { spreadSx } from "@src/utils/ui";

export interface IEditorCellTextFieldProps extends IEditorCellProps<string> {
  InputProps?: Partial<InputBaseProps>;
}

export default function EditorCellTextField({
  column,
  value,
  onSubmit,
  setFocusInsideCell,
  InputProps = {},
}: IEditorCellTextFieldProps) {
  const [localValue, setLocalValue] = useSaveOnUnmount(value, onSubmit);
  const maxLength = column.config?.maxLength;

  return (
    <InputBase
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      fullWidth
      autoFocus
      onKeyDown={(e) => {
        if (
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowDown"
        ) {
          e.stopPropagation();
        }
        if (e.key === "Escape") {
          // Escape removes focus inside cell, this runs before save on unmount
          setLocalValue(value);
        }
        if (e.key === "Enter" && !e.shiftKey) {
          // Removes focus from inside cell, triggering save on unmount
          setFocusInsideCell(false);
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      {...InputProps}
      inputProps={{ maxLength, ...InputProps.inputProps }}
      sx={[
        {
          width: "100%",
          height: "calc(100% - 1px)",
          marginTop: "1px",
          paddingBottom: "1px",

          backgroundColor: "var(--cell-background-color)",
          outline: "inherit",
          outlineOffset: "inherit",

          font: "inherit", // Prevent text jumping
          letterSpacing: "inherit", // Prevent text jumping

          "& .MuiInputBase-input": { p: "var(--cell-padding)" },

          "& textarea.MuiInputBase-input": {
            lineHeight: (theme) => theme.typography.body2.lineHeight,
            maxHeight: "100%",
            boxSizing: "border-box",
            py: 3 / 8,
          },
        },
        ...spreadSx(InputProps.sx),
      ]}
    />
  );
}