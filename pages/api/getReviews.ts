import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils";
import { Data } from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  try {
    const take = req.query.take;

    if (take !== undefined && isNaN(Number(take))) {
      return res.status(400).json({
        success: false,
        message: "You have a type error!",
      });
    }

    const reviews = await prisma.review.findMany({
      take: !take ? 10 : Number(take),
    });

    /* Remove id from request */
    const filterReviews = reviews.map(({ id, ...reviews }) => reviews);

    res.json({
      success: true,
      message: "Successfully gathered reviews!",
      data: {
        ...filterReviews,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred whilst fetching review(s)!",
    });
  }
}
