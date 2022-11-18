// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Event } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestMethods } from "../../../enum/RequestMethods";
import prisma from "../../../libs/prisma";

type Error = {
  code: number;
  message: string;
};

type Success = {
  code: number;
  result: Event | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error | Success>
) {
  const method = req.method;

  switch (method) {
    case RequestMethods.GET: {
      const { id } = req.query;

      if (!id)
        return res.status(400).json({ code: 400, message: "ID is missing" });

      const result = await prisma.event.findFirst({
        where: {
          id: parseInt(id as string),
        },
      });

      return res.status(200).json({ code: 200, result });
    }

    case RequestMethods.DELETE: {
      const { id } = req.query;

      if (!id)
        return res.status(400).json({ code: 400, message: "ID is missing" });

      const result = await prisma.event.delete({
        where: {
          id: parseInt(id as string),
        },
      });

      return res.status(200).json({ code: 200, result });
    }
  }
}
