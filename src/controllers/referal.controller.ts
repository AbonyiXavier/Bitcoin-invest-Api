import { Request, Response } from 'express';
import { Referal } from './../models/referal.model';
import { clientUrl } from './../config/client';

export const createreferalLink = async (req: Request, res: Response) => {
  try {
    const { userName } = req.body;
    const getReferal = await Referal.findOne({ userName: userName }).exec();

    if (getReferal) {
      return res.status(401).json({
        error: 'Referal link with that username already exists.',
        success: false,
      });
    }
    // const getReferal = await Referal.find({}).exec();

    // getReferal.forEach((item) => {
    //   if (item.userName === userName) {
    //     return res.status(401).json({
    //       error: 'Referal link with that username already exists.',
    //       success: false,
    //     });
    //   }
    // });

    const newLink = await new Referal({
      userName,
      owner: req.currentUser._id,
    });

    let link = `${clientUrl}api/v1/signup?ref=${newLink.userName}`;

    let savedLink = await newLink.save();

    let linkUpdate = await Referal.findOneAndUpdate(
      {
        _id: savedLink._id,
      },
      {
        $set: { referalUrl: link, owner: req.currentUser._id },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      data: linkUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const getReferalLink = async (req: Request, res: Response) => {
  try {
    const getReferal = await Referal.find({})
      .populate([
        {
          path: 'owner',
          model: 'User',
          select: 'name email _id emailConfirm blocked',
        },
      ])
      .exec();
    console.log('meeee', getReferal);

    return res.send(getReferal);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};
