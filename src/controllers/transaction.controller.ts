import { Request, Response } from 'express';
import { Transaction } from './../models/transaction.model';
import { Plan } from './../models/plan.model';
import { User } from './../models/user.model';
import createError from 'http-errors';
import { Mail } from './../helpers/mailer';
import { clientUrl } from './../config/client';
import { calculateInvestmentMaturityDate } from './../helpers/auth.service';
import { db } from './../Database/connect';
import { isToday, formatISO } from 'date-fns';

export const createTransaction = async (req: Request, res: Response) => {
  const session = await db.startSession();
  session.startTransaction();
  try {
    const opts = { session };

    const endDate = calculateInvestmentMaturityDate(new Date(), 3); // date the rate will be due, like this one is for 3months

    const interestRate = await Plan.findOne({ _id: req.body.plan });

    // const firstInvestment = await Transaction.find({ owner: req.currentUser._id }); // []

    // const refferedAccountToCredit = req.currentUser.referredBy;
    // if (firstInvestment.length === 0 && refferedAccountToCredit !== null) {
    //   const user = await User.findOne({ userName: refferedAccountToCredit });
    //   await User.findOneAndUpdate(
    //     { userName: refferedAccountToCredit },
    //     {
    //       $inc: {
    //         wallet_balance: Number(user!.wallet_balance) + Number(500),
    //       },
    //     },
    //     opts
    //   );
    // }
    // console.log("interest_rate", interestRate);

    const monthlyRate = (parseFloat(req.body.amount) * interestRate!.interest_rate) / 100;
    console.log('month', monthlyRate);
    let roundMonthlyRate = Math.round(monthlyRate);

    const user = await User.findOne({ _id: req.currentUser._id });

    const newTransaction = await new Transaction({
      amount: req.body.amount,
      // txn_type: 'deposit',
      end_date: endDate.jsDate,
      plan: req.body.plan,
      monthly_rate: roundMonthlyRate,
      status: 'active',
      owner: req.currentUser._id,
    });

    await newTransaction.save();

    await session.commitTransaction();
    session.endSession();

    const options = {
      mail: user!.email,
      me: 'francisxavier96@yahoo.com',
      subject: "Welcome to Bitcoin Store!, Deposit to account",
      email: "../email/deposit.html",
      variables: { name: user!.name, },
    };
    Mail(options);
    return res.json({
       message: `Bitcoin account sent to ${user!.email}`,
      success: true,
      newTransaction,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const approveTransaction = async (req: Request, res: Response) => {
  const session = await db.startSession();
  session.startTransaction();
  try {
    const opts = { session };

    const { id } = req.params;
    const trnx = await Transaction.findOne({ _id: id })
      .populate([
        {
          path: 'owner',
          model: 'User',
          select: 'name email _id referredBy emailConfirm blocked',
        },
      ])
      .exec();

    if (!trnx) {
      throw new createError.BadRequest(`Transaction doesn't exist`);
    }
    if (trnx.approved && trnx.approved !== null) {
      throw new createError.BadRequest(`Sorry Transaction is already approved`);
    }
    if (!trnx.approved && trnx.approved !== null) {
      throw new createError.BadRequest(`Sorry Transaction is already blocked/unapproved`);
    }
    let approve = !trnx.approved;

    const firstInvestment = await Transaction.find({ owner: trnx.owner._id }); // []

    const refferedAccountToCredit = trnx.owner.referredBy;
    if (firstInvestment.length === 1 && refferedAccountToCredit !== null) {
      const user = await User.findOne({ userName: refferedAccountToCredit });
      await User.findOneAndUpdate(
        { userName: refferedAccountToCredit },
        {
          $inc: {
            wallet_balance: Number(user!.wallet_balance) + Number(500),
          },
        },
        opts
      );
    }

    await session.commitTransaction();
    session.endSession();

    const trnxSaved = await Transaction.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: { approved: approve },
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

    if (trnxSaved?.approved) {
      // let link = `${clientUrl}profile/${trnxSaved.owner.name}`;
      let message = 'Your Transaction was Approved, thanks for the kindness';
      const options = {
        mail: trnxSaved.owner.email,
        me: 'francisxavier96@yahoo.com',
        subject: 'YAY! Transaction approved!',
        email: './../services/email/templates/notify.html',
        variables: {
          name: trnxSaved.owner.name,
          heading: 'Transaction APPROVED',
          message: message,
          // link: link,
          buttonText: 'SEE MY Transaction',
        },
      };
      await Mail(options);
    }
    return res.status(200).send('Transaction was approved!');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const txn = await Transaction.find({})
      .populate([
        {
          path: 'owner',
          model: 'User',
          select: 'name email _id emailConfirm blocked',
        },
      ])
      .populate([{ path: 'plan', model: 'Plan', select: 'name interest_rate' }])
      .exec();
    return res.send(txn);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const checkInvestmentAndClose = async () => {
  const session = await db.startSession();
  session.startTransaction();
  try {
    const result: any = formatISO(new Date());

    const getValue = await Transaction.find({
      status: 'active',
      approved: true,
      end_date: {
        $gte: result,
      },
    }).exec();
    console.log('value', getValue);

    // Update user wallet amount
    getValue.forEach(async (item) => {
      const user = await User.findOne({ _id: item.owner });

      await User.findOneAndUpdate(
        {
          _id: item.owner,
        },
        {
          $inc: {
            wallet_balance: Number(user!.wallet_balance) + Number(item.monthly_rate),
          },
        },
        {
          session,
        }
      );
      const today = isToday(new Date(item.end_date));

      if (today) {
        // change status to closed
        await Transaction.findOneAndUpdate(
          {
            _id: item._id,
          },
          { $set: { status: 'closed' } },
          {
            session,
          }
        );
      }
    });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log('error', error);

    // return res.status(500).json({
    //   message: error.message,
    //   error: 'There was an error. Please try again.',
    //   success: false
    // });
  }
};
