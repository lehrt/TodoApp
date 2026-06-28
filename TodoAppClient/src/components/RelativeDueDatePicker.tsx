import { Field, Input, Select } from "@fluentui/react-components";
import { useMemo } from "react";

import { useTodoListStyles } from "../styles/Todo.styles";

export type RelativeUnit = "Seconds" | "Minutes" | "Days" | "Weeks" | "Months";

interface RelativeDueDatePickerProps {
  value: string;
  unit: RelativeUnit;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: RelativeUnit) => void;
}

const getValidationMessage = (value: string) => {
  if (!value.trim()) {
    return undefined;
  }

  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return "Enter a valid number greater than 0.";
  }

  return undefined;
};

export const RelativeDueDatePicker = ({
  value,
  unit,
  onValueChange,
  onUnitChange,
}: RelativeDueDatePickerProps) => {
  const styles = useTodoListStyles();
  const validationMessage = useMemo(() => getValidationMessage(value), [value]);

  return (
    <div className={styles.relativeRow}>
      <Field
        label="Amount"
        required
        validationState={validationMessage ? "error" : undefined}
        validationMessage={validationMessage}
      >
        <Input
          value={value}
          onChange={(_, data) => onValueChange(data.value)}
          placeholder="10"
          inputMode="numeric"
        />
      </Field>
      <Field label="Unit" required>
        <Select
          value={unit}
          onChange={(_, data) => onUnitChange(data.value as RelativeUnit)}
        >
          <option value="Seconds">Seconds</option>
          <option value="Minutes">Minutes</option>
          <option value="Days">Days</option>
          <option value="Weeks">Weeks</option>
          <option value="Months">Months</option>
        </Select>
      </Field>
    </div>
  );
};
