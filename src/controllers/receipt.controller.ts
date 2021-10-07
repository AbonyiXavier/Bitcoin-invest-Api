import { Request, Response } from 'express';
import { Receipt } from './../models/receipt.model';
import { ReceiptMail } from './../helpers/receiptMailer';
import { createPdfFile } from './../helpers/createPDF';

export const createReceipt = async (req: Request, res: Response) => {
  try {
    const { full_name, total_amount, txn_type } = req.body;
    const receipt = await new Receipt({
      full_name,
      total_amount,
      txn_type,
    });
    
    const variableData = {
      full_name: receipt.full_name,
      total_amount: receipt.total_amount,
      txn_type: receipt.txn_type,
      createdAt: receipt.createdAt,
    };

    const filename = `${receipt._id}`;

    await createPdfFile(filename, variableData);

    const options = {
      mail: 'admin@alexawealthmngt.com',
      subject: 'Transaction Receipt file',
      variables: {
        name: receipt.full_name,
      },
      email: '../email/receiptMail.html',
      attachment: filename,
      filename: filename,
    };

    setTimeout(async () => {
      await ReceiptMail(options);
      return res.status(200).send('Transaction Receipt Sent!');
    }, 60000);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};
