import {
  Button,
  Card,
  CardHeader,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Divider,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Subtitle1,
  TableCellLayout,
  TableColumnDefinition,
  Text,
  Title3,
  createTableColumn,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";

import { MoreVerticalRegular } from "@fluentui/react-icons";
import { TodoForm } from "./TodoForm";
import { Todo } from "../types/Todo";
import { todoService } from "../services/todoService";
import { useTodoListStyles } from "../styles/Todo.styles";

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingTodo, setIsDeletingTodo] = useState(false);
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [todoFormMode, setTodoFormMode] = useState<"create" | "edit">("create");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const styles = useTodoListStyles();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const isPastDueDate = (dateString: string | null) => {
    if (!dateString) return false;
    return new Date(dateString).getTime() < Date.now();
  };

  const openCreateTodoForm = () => {
    setTodoFormMode("create");
    setSelectedTodo(null);
    setIsTodoFormOpen(true);
  };

  const openEditTodoForm = (todo: Todo) => {
    setTodoFormMode("edit");
    setSelectedTodo(todo);
    setIsTodoFormOpen(true);
  };

  const openDeleteDialog = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeleteDialogOpen(true);
  };

  const closeTodoForm = () => {
    setIsTodoFormOpen(false);
    setSelectedTodo(null);
  };

  const closeDeleteDialog = () => {
    if (isDeletingTodo) {
      return;
    }

    setIsDeleteDialogOpen(false);
    setSelectedTodo(null);
  };

  const handleDeleteTodo = async () => {
    if (!selectedTodo) {
      return;
    }

    try {
      setIsDeletingTodo(true);
      await todoService.deleteTodo(selectedTodo.id);
      await loadTodos();
      closeDeleteDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo.");
    } finally {
      setIsDeletingTodo(false);
    }
  };

  const columns: TableColumnDefinition<Todo>[] = [
    createTableColumn<Todo>({
      columnId: "name",
      compare: (a, b) => a.name.localeCompare(b.name),
      renderHeaderCell: () => "Name",
      renderCell: (item) => (
        <TableCellLayout>
          <Text weight="semibold">{item.name}</Text>
        </TableCellLayout>
      ),
    }),
    createTableColumn<Todo>({
      columnId: "details",
      renderHeaderCell: () => "Details",
      renderCell: (item) => (
        <TableCellLayout>{item.additionalDetails || "-"}</TableCellLayout>
      ),
    }),
    createTableColumn<Todo>({
      columnId: "due",
      compare: (a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      },
      renderHeaderCell: () => "Due Date",
      renderCell: (item) => (
        <TableCellLayout>
          <Text
            className={
              isPastDueDate(item.dueDate)
                ? styles.overdueDueDateText
                : undefined
            }
          >
            {formatDate(item.dueDate)}
          </Text>
        </TableCellLayout>
      ),
    }),
    createTableColumn<Todo>({
      columnId: "actions",
      renderHeaderCell: () => "Actions",
      renderCell: (item) => (
        <TableCellLayout>
          <Menu>
            <MenuTrigger>
              <Button
                appearance="subtle"
                icon={<MoreVerticalRegular />}
                aria-label={`Actions for ${item.name}`}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => openEditTodoForm(item)}>
                  Edit
                </MenuItem>
                <MenuItem onClick={() => openDeleteDialog(item)}>
                  Delete
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </TableCellLayout>
      ),
    }),
  ];

  const columnSizingOptions = {
    name: {
      minWidth: 220,
      defaultWidth: 340,
      idealWidth: 380,
    },
    details: {
      minWidth: 260,
      defaultWidth: 420,
      idealWidth: 480,
    },
    due: {
      minWidth: 110,
      defaultWidth: 140,
      idealWidth: 160,
    },
    actions: {
      minWidth: 56,
      defaultWidth: 56,
      idealWidth: 56,
    },
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spinner label="Loading todos..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Text className={styles.errorText} size={500}>
          Error: {error}
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title3 as="h1">My Todos</Title3>
        <Divider className={styles.divider} />
        <Subtitle1 as="p" role="status" aria-live="polite">
          Total: {todos.length}
        </Subtitle1>
      </div>

      <Card className={styles.card}>
        <CardHeader
          header={<Text weight="semibold" as="h2">All Tasks</Text>}
          action={
            <div className={styles.cardHeaderActions}>
              <Button appearance="primary" onClick={openCreateTodoForm}>
                Create Todo
              </Button>
            </div>
          }
        />
        {todos.length === 0 ? (
          <Text role="status">No todos found. Create your first todo!</Text>
        ) : (
          <DataGrid
            items={todos}
            columns={columns}
            sortable
            resizableColumns
            columnSizingOptions={columnSizingOptions}
            getRowId={(item) => item.id.toString()}
          >
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell }) => (
                  <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<Todo>>
              {({ item, rowId }) => (
                <DataGridRow<Todo> key={rowId}>
                  {({ renderCell }) => (
                    <DataGridCell>{renderCell(item)}</DataGridCell>
                  )}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
        )}
      </Card>

      <TodoForm
        open={isTodoFormOpen}
        mode={todoFormMode}
        editTodo={todoFormMode === "edit" ? selectedTodo : null}
        onClose={closeTodoForm}
        onSuccess={loadTodos}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(_, data) => !data.open && closeDeleteDialog()}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete Todo</DialogTitle>
            <DialogContent>
              <Text>
                Delete{" "}
                {selectedTodo ? `"${selectedTodo.name}"` : "this todo"}? This
                action cannot be undone.
              </Text>
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={closeDeleteDialog}
                disabled={isDeletingTodo}
              >
                Cancel
              </Button>
              <Button
                appearance="primary"
                onClick={handleDeleteTodo}
                disabled={isDeletingTodo}
              >
                {isDeletingTodo ? "Deleting..." : "Delete"}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
