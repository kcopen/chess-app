export const BLACK_SQUARE_COLOR = "#556b2f";
export const WHITE_SQUARE_COLOR = "#ffffe0";

export const square_color = (color: string) => {
	if (color === "white") return WHITE_SQUARE_COLOR;
	if (color === "black") return BLACK_SQUARE_COLOR;
};
