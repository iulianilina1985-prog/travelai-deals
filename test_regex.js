function strip(s) {
    return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function extractFlightData(text) {
    const t = strip(text);

    if (!t.includes("zbor") && !t.includes("avion")) return null;

    const routeMatch =
        t.match(/din\s+([a-z ]+?)\s+(?:la|spre|catre)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
        t.match(/(?:la|spre|catre)\s+([a-z ]+?)\s+din\s+([a-z ]+?)(?=\s+\d|\s*$)/)?.slice(1).reverse() ||
        t.match(/zbor\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
        t.match(/avion\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
        t.match(/([a-z ]+?)\s*(?:->|→|-)\s*([a-z ]+?)(?=\s+\d|\s*$)/);

    if (!routeMatch) return null;

    const from = routeMatch[1].trim();
    const to = routeMatch[2].trim();

    const paxMatch = t.match(/(\d+)\s*(pasageri|persoane|adulti)/);
    const passengers = paxMatch ? Number(paxMatch[1]) : 1;

    const monthMap = {
        ianuarie: "01", februarie: "02", martie: "03", aprilie: "04",
        mai: "05", iunie: "06", iulie: "07", august: "08",
        septembrie: "09", octombrie: "10", noiembrie: "11", decembrie: "12",
    };

    let day, month, year;

    const textDate = t.match(
        /(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/
    );

    const numericDate = t.match(
        /(\d{1,2})[./-](\d{1,2})[./-](\d{4})/
    );

    if (textDate) {
        day = textDate[1];
        month = monthMap[textDate[2]];
        year = textDate[3];
    }
    else if (numericDate) {
        day = numericDate[1];
        month = numericDate[2].padStart(2, "0");
        year = numericDate[3];
    }
    else {
        return null;
    }

    const pad = (n) => n.padStart(2, "0");

    return {
        from_city: from,
        to_city: to,
        depart_date: `${year}-${month}-${pad(day)}`,
        passengers,
    };
}

const inputs = [
    "zbor din bucuresti catre paris 22.02.2026 2 persoane",
    "zbor viena madrid 10 mai 2026",
    "avion londra roma 5/6/2026"
];

inputs.forEach(input => {
    console.log(`Input: ${input}`);
    console.log(`Result:`, extractFlightData(input));
    console.log('---');
});
