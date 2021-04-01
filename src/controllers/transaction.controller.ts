import { Request, Response } from 'express';
import { Transaction } from './../models/transaction.model'
import shortid from 'shortid';
import createError from "http-errors";
import { Mail } from "./../helpers/mailer"
import { clientUrl } from "./../config/client"

export const createTransaction = async (req: Request, res: Response) => {
    try {                 
    const newTransaction = await new Transaction({
        txn_id: shortid.generate(),
        wallet_address: req.body.wallet_address,
        amount: req.body.amount,
        txn_type: 'deposit',
        owner: req.currentUser.payload.user._id 
    })    
    await newTransaction.save()
    return res.send(newTransaction) 
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        error: 'There was an error. Please try again.',
        success: false
      });
    }
  }

  export const approveTransaction = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const trnx = await Transaction.findOne({ _id: id }).populate([{"path":"owner", "model":"User",  "select": "name email _id emailConfirm blocked"}]).exec()  
        if (!trnx) {
          throw new createError.BadRequest(`Transaction doesn't exist`);
        }
        if (trnx.approved && trnx.approved !== null) {
          throw new createError.BadRequest(`Sorry Transaction is already approved`);
        }
        if (!trnx.approved && trnx.approved !== null) {
          throw new createError.BadRequest(`Sorry Transaction is already blocked/unapproved`);
        }
        let approve = !trnx.approved
        
        const trnxSaved = await Transaction.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $set: { approved: approve, owner: req.currentUser.payload.user._id },
          },
          {
            new: true,
          }
        ).populate([{"path":"owner", "model":"User",  "select": "name email _id emailConfirm blocked"}])
        
            if (
              trnxSaved?.approved
            ) {
              let link = `${clientUrl}profile/${trnxSaved.owner.name}`;
              let message = "Your Transaction was Approved, thanks for the kindness";
              const options = {
                mail: trnxSaved.owner.email,
                subject: "YAY! Transaction approved!",
                email: "./../services/email/templates/notify.html",
                variables: {
                  name: trnxSaved.owner.name,
                  heading: "Transaction APPROVED",
                  message: message,
                  link: link,
                  buttonText: "SEE MY Transaction",
                },
              };
              await Mail(options);
            }
            return res.status(200).send("Transaction was approved!");
          
       
      } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: 'There was an error. Please try again.',
            success: false
          });
      }
  }

export const getTransaction = async (req: Request, res: Response) => {
    try {        
      const txn = await Transaction.find({ }).populate([{"path":"owner", "model":"User",  "select": "name email _id emailConfirm blocked"}]).exec()        
      return res.send(txn)        
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        error: 'There was an error. Please try again.',
        success: false
      });
    }
  }
