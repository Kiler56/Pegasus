// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Lesson } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestMethods } from "../../../enum/RequestMethods";
import prisma from "../../../libs/prisma";
import { customAlphabet } from "nanoid";

type Error = {
  code: number;
  message: string;
};

type GetSuccess = {
  code: number;
  result: Lesson[];
};

type PostSuccess = {
  code: number;
  result: Lesson;
};

type PostBody = {
  name: string;
};

const genCodeAlphabet = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error | GetSuccess | PostSuccess>
) {
  const method = req.method;

  switch (method) {
    case RequestMethods.GET: {
      const result = await prisma.lesson.findMany();

      return res.status(200).json({ code: 200, result });
    }

    case RequestMethods.POST: {
      const body: PostBody = req.body;
      const code = genCodeAlphabet(5);

      const result = await prisma.lesson.create({
        data: {
          code,
          name: body.name,
          professor_id: 1,
        },
      });

      return res.status(200).json({ code: 200, result });
    }
  }
}
