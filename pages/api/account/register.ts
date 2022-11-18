// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestMethods } from "../../../enum/RequestMethods";
import { UserType } from "../../../enum/UserType";
import firebaseAdmin from "../../../libs/firebaseAdmin";
import firebaseApp from "../../../libs/firebaseApp";
import prisma from "../../../libs/prisma";

type RegisterResponse = {
  token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
) {
  const method = req.method;

  if (method !== RequestMethods.POST) return res.status(405);

  const { userType, ...body } = req.body;

  if (body.password !== body.confirmPassword) return res.status(400);

  const firebaseCredentials = await createUserWithEmailAndPassword(
    firebaseApp.auth,
    body.email,
    body.password
  );

  const token = await firebaseAdmin.auth.createCustomToken(
    firebaseCredentials.user.uid
  );

  switch (userType) {
    case UserType.PROFESSOR: {
      await prisma.professor.create({
        data: {
          name: body.name,
          surname: body.surname,
          id: firebaseCredentials.user.uid,
        },
      });
      break;
    }

    case UserType.STUDENT: {
      await prisma.student.create({
        data: {
          id: firebaseCredentials.user.uid,
          username: body.username,
        },
      });
      break;
    }
    default:
      return res.status(400);
  }

  return res.status(200).send({ token });
}
