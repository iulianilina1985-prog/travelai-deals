const t = "zbor din bucuresti spre londra pe 20 martie 2026";

const routeMatch =
    t.match(/din\s+([a-z ]+?)\s+(?:la|spre|catre)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/zbor\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/([a-z ]+?)\s*(?:->|→|-)\s*([a-z ]+?)(?=\s+\d|\s*$)/);

console.log("Route:", routeMatch);

// Correct regex from my updated code
const dateMatchCorrect = t.match(
    /(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/
);

console.log("Date:", dateMatchCorrect);
