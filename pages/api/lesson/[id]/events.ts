// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Event } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestMethods } from "../../../../enum/RequestMethods";
import prisma from "../../../../libs/prisma";

type Error = {
  code: number;
  message: string;
};

type GetSuccess = {
  code: number;
  result: Event[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error | GetSuccess>
) {
  const method = req.method;

  if (method === RequestMethods.GET) {
    const { id } = req.query;

    if (!id)
      return res.status(400).json({ code: 400, message: "ID is missing" });

    const result = await prisma.event.findMany({
      where: {
        id: parseInt(id as string),
      },
    });

    return res.status(200).json({ code: 200, result });
  }
}
