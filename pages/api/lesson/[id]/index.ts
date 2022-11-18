// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Lesson } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestMethods } from "../../../../enum/RequestMethods";
import prisma from "../../../../libs/prisma";
import getSession from "../../../../utils/getSession";

type Error = {
  code: number;
  message: string;
};

type GetSuccess = {
  code: number;
  result: Lesson | null;
};

type JoinSuccess = {
  code: number;
  result: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error | GetSuccess | JoinSuccess>
) {
  const method = req.method;

  switch (method) {
    case RequestMethods.GET: {
      const { id } = req.query;

      if (!id)
        return res.status(400).json({ code: 400, message: "ID is missing" });

      const result = await prisma.lesson.findFirst({
        where: {
          id: parseInt(id as string),
        },
        include: {
          professor: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      return res.status(200).json({ code: 200, result });
    }
    case RequestMethods.POST: {
      const session = await getSession(req);

      if (!session.loggedIn || !session.data)
        return res.status(403).json({ code: 403, message: "Forbidden" });

      const { id } = req.query;
      const { type } = req.body;

      if (!id)
        return res.status(400).json({ code: 400, message: "ID is missing" });

      if (!type)
        return res.status(400).json({ code: 400, message: "Type is missing" });

      let result;

      if (type === "JOIN") {
        await prisma.studentsOnLessons.create({
          data: {
            lesson_id: parseInt(id as string),
            student_id: session.data.id,
          },
        });

        result = true;
      } else {
        await prisma.studentsOnLessons.delete({
          where: {
            student_id_lesson_id: {
              lesson_id: parseInt(id as string),
              student_id: session.data.id,
            },
          },
        });

        result = false;
      }

      return res.status(200).json({ code: 200, result });
    }
    case RequestMethods.DELETE: {
      const { id } = req.query;

      if (!id)
        return res.status(400).json({ code: 400, message: "ID is missing" });

      const result = await prisma.lesson.delete({
        where: {
          id: parseInt(id as string),
        },
      });

      return res.status(200).json({ code: 200, result });
    }
    default:
      return res.status(405);
  }
}
