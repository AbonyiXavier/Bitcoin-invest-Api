import { Request, Response } from 'express';
import { Plan } from './../models/plan.model';


export const createPlan =  async (req: Request, res: Response) => {
    try {
        
        const { name, interest_rate } = req.body;
        const newPlan = await  new Plan({
            name,
            interest_rate
        })

        await newPlan.save()
      return res.send(newPlan) 

    } catch (error) {
        return res.status(500).json({
          message: error.message,
          error: 'There was an error. Please try again.',
          success: false
        });
      }
}