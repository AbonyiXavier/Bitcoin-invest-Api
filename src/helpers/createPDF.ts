const ejs = require('ejs');
import createError from 'http-errors';
import path from 'path';
import fs from 'fs';
import pdf from 'html-pdf';


interface Ioption  {
    format: "Letter" | "A3" | "A4" | "A5" | "Legal" | "Tabloid" | undefined;
    timeout: number;
}

export const createPdfFile = async (fileName = 'default', variables: any) => {
    const options: Ioption = { format: 'Letter', timeout: 600000 };

  ejs.renderFile(
    path.join(__dirname, '../email/transactionReceipt.html'),
    variables,
    function (err: any, str: any) {
      if (err) {
        console.log(err);
        throw new createError.Conflict(`Having difficulties sending receipt!`);
      } else {
        pdf
          .create(str, options)
          .toFile(`src/./email/transaction-receipt/${fileName}.pdf`, function (err: any, res: any) {
        //   .toFile(`src/./files/transaction-receipt/${fileName}.pdf`, function (err: any, res: any) {
            if (err) {
              console.log('file err', err);
              throw new createError.Conflict(
                `Having difficulties sending receipts right now, try later!`
              );
            }
            return res;
          });
      }
    }
  );
};
