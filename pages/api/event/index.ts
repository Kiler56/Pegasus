// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Event } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestMethods } from "../../../enum/RequestMethods";
import prisma from "../../../libs/prisma";

type Error = {
  code: number;
  message: string;
};

type GetSuccess = {
  code: number;
  result: Event[] | null;
};

type PostSuccess = {
  code: number;
  result: Event | null;
};

type PostBody = {
  title: string;
  description: string;
  start: string;
  end: string;
  lesson_id?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error | GetSuccess | PostSuccess>
) {
  const method = req.method;

  switch (method) {
    case RequestMethods.GET: {
      const result = await prisma.event.findMany();

      return res.status(200).json({ code: 200, result });
    }
    case RequestMethods.POST: {
      const body: PostBody = req.body;
      console.log(body);
      const result = await prisma.event.create({
        data: {
          description: body.description,
          end: new Date(body.end),
          start: new Date(body.start),
          title: body.title,
        },
      });

      return res.status(200).json({ code: 200, result });
    }
  }
}
