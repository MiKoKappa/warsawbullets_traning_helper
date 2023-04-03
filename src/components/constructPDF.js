import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function constructPDF(date, firstSession, secondSession) {
    const dd = {
        background:
        {
            image: "data:image/jpeg;base64,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",
            alignment: 'right',
            margin: [0, -5, 20, 0],
            width: 100
        },
        content: [
            'Trening: ' + date.toLocaleDateString(),
            { text: 'Wejście I', style: 'header' },
            {
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'N.p.', bold: true }, { text: 'Opis ćwiczenia', bold: true }, { text: 'Psy', bold: true }, { text: 'Zadania', bold: true }, { text: 'Odznaczanie', bold: true }],

                    ]
                },
                pageBreak: 'after'
            },
            { text: 'Wejście II', style: 'header' },
            {
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'N.p.', bold: true }, { text: 'Opis ćwiczenia', bold: true }, { text: 'Psy', bold: true }, { text: 'Zadania', bold: true }, { text: 'Odznaczanie', bold: true }],
                    ]
                }
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        }
    }
    firstSession.sort((a, b) => a.id - b.id).map((v, i) => [String(i + 1), String(v.activity), String(v.dogs.join(", ")), String(typeof v.tasks === "undefined" ? "" : v.tasks), " "]).forEach(elem => {
        dd.content[2].table.body.push(elem);
    });
    secondSession.sort((a, b) => a.id - b.id).map((v, i) => [String(i + 1), String(v.activity), String(v.dogs.join(", ")), String(v.tasks), " "]).forEach(elem => {
        dd.content[4].table.body.push(elem);
    });
    pdfMake.createPdf(dd).download("WarsawBullets_Trening_" + date.toLocaleDateString() + ".pdf");
}