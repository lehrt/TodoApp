import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  Select,
  Spinner,
  Text,
} from "@fluentui/react-components";
import { type FormEvent, useEffect, useState } from "react";

import {
  RelativeDueDatePicker,
  type RelativeUnit,
} from "./RelativeDueDatePicker";
import type { Todo } from "../types/Todo";
import { todoService } from "../services/todoService";
import { useTodoListStyles } from "../styles/Todo.styles";

type DueDateMode = "absolute" | "relative";

interface TodoFormProps {
  open: boolean;
  mode: "create" | "edit";
  editTodo?: Todo | null;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export const TodoForm = ({
  open,
  mode,
  editTodo,
  onClose,
  onSuccess,
}: TodoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const styles = useTodoListStyles();

  // Initialize form state based on mode and editTodo
  const getInitialName = () =>
    mode === "edit" && editTodo ? editTodo.name : "";
  const getInitialDescription = () =>
    mode === "edit" && editTodo ? (editTodo.additionalDetails ?? "") : "";
  const getInitialReminders = () =>
    mode === "edit" && editTodo ? editTodo.remindersEnabled : true;
  const getInitialDueDate = () => {
    if (mode === "edit" && editTodo?.dueDate) {
      return new Date(editTodo.dueDate).toISOString().slice(0, 10);
    }
    return "";
  };

  const [name, setName] = useState(getInitialName);
  const [description, setDescription] = useState(getInitialDescription);
  const [dueDateMode, setDueDateMode] = useState<DueDateMode>("absolute");
  const [absoluteDueDate, setAbsoluteDueDate] = useState(getInitialDueDate);
  const [relativeDueDateValue, setRelativeDueDateValue] = useState("");
  const [relativeDueDateUnit, setRelativeDueDateUnit] =
    useState<RelativeUnit>("Days");
  const [remindersEnabled, setRemindersEnabled] = useState(getInitialReminders);

  // Reset form state when dialog opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      // Reset on close
      setFormError(null);
      return;
    }

    // Set form values based on mode
    if (mode === "create") {
      setName("");
      setDescription("");
      setDueDateMode("absolute");
      setAbsoluteDueDate("");
      setRelativeDueDateValue("");
      setRelativeDueDateUnit("Days");
      setRemindersEnabled(true);
      setFormError(null);
    } else if (mode === "edit" && editTodo) {
      setName(editTodo.name);
      setDescription(editTodo.additionalDetails ?? "");
      setDueDateMode("absolute");
      setAbsoluteDueDate(
        editTodo.dueDate
          ? new Date(editTodo.dueDate).toISOString().slice(0, 10)
          : "",
      );
      setRelativeDueDateValue("");
      setRelativeDueDateUnit("Days");
      setRemindersEnabled(editTodo.remindersEnabled);
      setFormError(null);
    }
  }, [open, mode, editTodo]);

  // Automatically disable reminders when due date is cleared
  useEffect(() => {
    if (!hasDueDate() && remindersEnabled) {
      setRemindersEnabled(false);
    }
  }, [absoluteDueDate, relativeDueDateValue, dueDateMode, remindersEnabled]);

  // Check if a due date is set
  const hasDueDate = () => {
    if (dueDateMode === "absolute") {
      return !!absoluteDueDate.trim();
    }
    return !!relativeDueDateValue.trim();
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    return !!name.trim();
  };

  // Check if the absolute due date is in the past
  const isDueDateInPast = () => {
    if (dueDateMode !== "absolute" || !absoluteDueDate) {
      return false;
    }
    const selectedDate = new Date(absoluteDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    return selectedDate < today;
  };

  const buildDueDatePayload = () => {
    const payload: {
      dueDate?: string;
      relativeDueDateValue?: number;
      relativeDueDateUnit?: "Seconds" | "Minutes" | "Hours" | "Days";
    } = {};

    if (dueDateMode === "absolute") {
      if (absoluteDueDate) {
        payload.dueDate = new Date(absoluteDueDate).toISOString();
      }
      return payload;
    }

    const parsedRelativeValue = Number(relativeDueDateValue);
    if (!Number.isFinite(parsedRelativeValue) || parsedRelativeValue <= 0) {
      throw new Error(
        "Relative due date value must be a valid number greater than 0.",
      );
    }

    let mappedValue = Math.floor(parsedRelativeValue);
    let mappedUnit: "Seconds" | "Minutes" | "Hours" | "Days" = "Days";

    if (relativeDueDateUnit === "Weeks") {
      mappedValue *= 7;
    } else if (relativeDueDateUnit === "Months") {
      mappedValue *= 30;
    } else {
      mappedUnit = relativeDueDateUnit;
    }

    payload.relativeDueDateValue = mappedValue;
    payload.relativeDueDateUnit = mappedUnit;

    return payload;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Name is required.");
      return;
    }

    let dueDatePayload;
    try {
      dueDatePayload = buildDueDatePayload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Invalid due date.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === "create") {
        await todoService.createTodo({
          name: trimmedName,
          additionalDetails: description.trim() || null,
          remindersEnabled,
          ...dueDatePayload,
        });
      } else {
        if (!editTodo) {
          setFormError("Missing todo data for edit mode.");
          return;
        }

        await todoService.updateTodo(editTodo.id, {
          name: trimmedName,
          additionalDetails: description.trim() || "",
          remindersEnabled,
          ...dueDatePayload,
        });
      }

      await onSuccess();
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save todo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>
              {mode === "create" ? "Create Todo" : "Edit Todo"}
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
              <div className={styles.createTodoForm}>
                <Field label="Name" required>
                  <Input
                    value={name}
                    onChange={(_, data) => setName(data.value)}
                    maxLength={50}
                  />
                </Field>

                <Field label="Description">
                  <Input
                    value={description}
                    onChange={(_, data) => setDescription(data.value)}
                    maxLength={200}
                  />
                </Field>

                <div className={styles.modeSelector}>
                  <Field label="Due Date Type">
                    <Select
                      id="dueDateMode"
                      value={dueDateMode}
                      onChange={(_, data) =>
                        setDueDateMode(data.value as DueDateMode)
                      }
                    >
                      <option value="absolute">Specific date</option>
                      <option value="relative">Relative time from now</option>
                    </Select>
                  </Field>
                </div>

                {dueDateMode === "absolute" ? (
                  <Field
                    label="Due Date"
                    validationState={isDueDateInPast() ? "warning" : undefined}
                    validationMessage={
                      isDueDateInPast()
                        ? "This due date is in the past"
                        : undefined
                    }
                  >
                    <Input
                      type="date"
                      value={absoluteDueDate}
                      onChange={(_, data) => setAbsoluteDueDate(data.value)}
                    />
                  </Field>
                ) : (
                  <RelativeDueDatePicker
                    value={relativeDueDateValue}
                    unit={relativeDueDateUnit}
                    onValueChange={setRelativeDueDateValue}
                    onUnitChange={setRelativeDueDateUnit}
                  />
                )}

                <Checkbox
                  label="Enable reminders"
                  checked={remindersEnabled}
                  disabled={!hasDueDate()}
                  onChange={(_, data) => setRemindersEnabled(!!data.checked)}
                />

                {formError ? (
                  <Text className={styles.formErrorText} size={300}>
                    {formError}
                  </Text>
                ) : null}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                appearance="primary"
                type="submit"
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Todo"
                    : "Save Changes"}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
