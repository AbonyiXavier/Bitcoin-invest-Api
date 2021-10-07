import { Request, Response } from 'express';
import { Withdraw } from './../models/withdraw.model';
import { User } from './../models/user.model';
import createError from 'http-errors';
import { Mail } from './../helpers/mailer';
import { clientUrl } from './../config/client';
import { ReceiptMail } from './../helpers/receiptMailer';
import { createPdfFile } from './../helpers/createPDF';

export const withdrawCoin = async (req: Request, res: Response) => {
  try {
    const { wallet_address, amount } = req.body;
    const user = await User.findOne({ _id: req.currentUser._id });
    // console.log('wallet', user);

    if (user!.wallet_balance < amount) {
      return res.status(403).json({
        message: 'insufficient wallet balance',
      });
    }

    if (user!.wallet_address !== wallet_address) {
      return res.status(403).json({
        message: 'incorrect wallet address!',
      });
    }

    const newWithdraw = await new Withdraw({
      wallet_address,
      amount,
      approved: 'pending',
      owner: req.currentUser._id,
    });
    await newWithdraw.save();
    let message = `withdrawal request of $${newWithdraw!.amount}`;

    const options = {
      mail: user?.email,
      me: 'admin@alexawealthmngt.com',
      subject: 'YAY! Withdrawal Request',
      email: '../email/withdraw.html',
      variables: {
        heading: 'Withdrawal Request',
        message: message,
        name: user!.name,
      },
    };
    Mail(options);
    return res.send(newWithdraw);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const approveWithdrawal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trnx = await Withdraw.findOne({ _id: id })
      .populate([
        {
          path: 'owner',
          model: 'User',
          select: 'name email _id emailConfirm blocked',
        },
      ])
      .exec();

    const user = await User.findOne({ _id: req.currentUser._id });

    const newBalance = user!.wallet_balance - trnx!.amount;

    if (!trnx) {
      throw new createError.BadRequest(`Transaction doesn't exist`);
    }
    if (trnx.approved && trnx.approved !== 'pending') {
      throw new createError.BadRequest(`Sorry Transaction is already approved`);
    }
    if (!trnx.approved && trnx.approved !== 'pending') {
      throw new createError.BadRequest(`Sorry Transaction is already blocked/unapproved`);
    }

    const trnxSaved = await Withdraw.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: { approved: 'approved', owner: req.currentUser._id },
      },
      {
        new: true,
      }
    ).populate([
      {
        path: 'owner',
        model: 'User',
        select: 'name email _id emailConfirm blocked',
      },
    ]);

    await User.findOneAndUpdate(
      {
        _id: user!._id,
      },
      {
        $set: { wallet_balance: newBalance },
      },
      {
        new: true,
      }
    );

    if (trnxSaved!.approved) {
      const variableData = {
        full_name: trnxSaved!.owner.name,
        total_amount: trnxSaved!.owner.amount,
        txn_type: 'withdraw',
        createdAt: new Date(),
      };
  
      const filename = `${trnx.owner._id}`;
  
      await createPdfFile(filename, variableData);
  
      const options = {
        mail: trnxSaved!.owner.email,
        subject: 'Transaction Receipt file',
        variables: {
          name: trnxSaved!.owner.name,
        },
        email: '../email/receiptMail.html',
        attachment: filename,
        filename: filename,
      };
  
      setTimeout(async () => {
        await ReceiptMail(options);
       return res.status(200).send({
          message: "Withdrawal was approved!",
          success: true,
       });
      }, 60000)
      // let link = `${clientUrl}withdraw/${trnxSaved!.owner.name}`;
      // let message =
      //   'Your withdrawal was Approved, kindly be patient, while your wallet address will be credited shortly';
      // const options = {
      //   mail: trnxSaved!.owner.email,
      //   me: 'admin@alexawealthmngt.com',
      //   subject: 'YAY! Withdrawal approved!',
      //   email: '../email/notify.html',
      //   variables: {
      //     name: trnxSaved!.owner.name,
      //     heading: 'Withdrawal  APPROVED',
      //     message: message,
      //     // link: link,
      //     buttonText: 'See my transaction',
      //   },
      // };
      // await Mail(options);
    }
    // return res.status(200).send('Withdrawal was approved!');
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};
