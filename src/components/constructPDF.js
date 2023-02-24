import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function constructPDF(date, firstSession, secondSession) {
    const dd = {
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
    firstSession.sort((a, b) => a.id - b.id).map((v, i) => [String(i + 1), String(v.activity), String(v.dogs.join(", ")), String(v.tasks), " "]).forEach(elem => {
        dd.content[2].table.body.push(elem);
    });
    secondSession.sort((a, b) => a.id - b.id).map((v, i) => [String(i + 1), String(v.activity), String(v.dogs.join(", ")), String(v.tasks), " "]).forEach(elem => {
        dd.content[4].table.body.push(elem);
    });
    pdfMake.createPdf(dd).download("WarsawBullets_Trening_" + date.toLocaleDateString() + ".pdf");
}