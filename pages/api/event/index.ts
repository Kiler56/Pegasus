// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Event } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestMethods } from "../../../enum/RequestMethods";
import { UserType } from "../../../enum/UserType";
import prisma from "../../../libs/prisma";
import getSession from "../../../utils/getSession";

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
      const session = await getSession(req);

      if (!session.loggedIn)
        return res.status(403).json({ code: 403, message: "Forbidden" });

      const body: PostBody = req.body;

      const result = await prisma.event.create({
        data: {
          description: body.description,
          end: new Date(body.end),
          start: new Date(body.start),
          title: body.title,
          professor_id:
            session.userType === UserType.PROFESSOR
              ? session.data?.id
              : undefined,
          student_id:
            session.userType === UserType.STUDENT
              ? session.data?.id
              : undefined,
          lesson_id: body.lesson_id ?? undefined,
        },
      });

      return res.status(200).json({ code: 200, result });
    }
    default:
      return res.status(405);
  }
}
