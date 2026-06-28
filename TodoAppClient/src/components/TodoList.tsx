import {
  Card,
  CardHeader,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Divider,
  Spinner,
  Subtitle1,
  TableCellLayout,
  TableColumnDefinition,
  Text,
  Title3,
  createTableColumn,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";

import { Todo } from "../types/Todo";
import { todoService } from "../services/todoService";
import { useTodoListStyles } from "../styles/Todo.styles";

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        <Title3>My Todos</Title3>
        <Divider className={styles.divider} />
        <Subtitle1>Total: {todos.length}</Subtitle1>
      </div>

      <Card className={styles.card}>
        <CardHeader header={<Text weight="semibold">All Tasks</Text>} />
        {todos.length === 0 ? (
          <Text>No todos found. Create your first todo!</Text>
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
    </div>
  );
};
