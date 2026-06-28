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
