import { makeStyles, tokens } from "@fluentui/react-components";

export const useTodoListStyles = makeStyles({
	container: {
		display: "flex",
		flexDirection: "column",
		gap: tokens.spacingVerticalL,
		padding: tokens.spacingVerticalXXL,
		maxWidth: "1200px",
		margin: "0 auto",
	},
	header: {
		marginBottom: tokens.spacingVerticalM,
	},
	divider: {
		marginTop: "8px",
		marginBottom: "8px",
	},
	card: {
		width: "100%",
	},
	cardHeaderActions: {
		display: "flex",
		alignItems: "center",
		gap: tokens.spacingHorizontalS,
	},
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		gap: tokens.spacingVerticalM,
		minWidth: "420px",
	},
	createTodoForm: {
		display: "flex",
		flexDirection: "column",
		gap: tokens.spacingVerticalM,
	},
	modeSelector: {
		display: "flex",
		flexDirection: "column",
		gap: tokens.spacingVerticalXS,
	},
	relativeRow: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: tokens.spacingHorizontalM,
	},
	formErrorText: {
		color: tokens.colorPaletteRedForeground1,
	},
	errorText: {
		color: tokens.colorPaletteRedForeground1,
	},
	overdueDueDateText: {
		color: tokens.colorPaletteRedForeground1,
	},
	loadingContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: tokens.spacingVerticalXXL,
	},
});
