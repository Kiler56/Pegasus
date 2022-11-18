import { Professor, Student } from "@prisma/client";
import { signInWithCustomToken } from "firebase/auth";
import { NextApiRequest } from "next";
import { UserType } from "../enum/UserType";
import admin from "../libs/firebaseAdmin";
import app from "../libs/firebaseApp";
import prisma from "../libs/prisma";

type Authentication = {
  loggedIn: boolean;
  userType?: UserType;
  data?: Student | Professor;
};

export default async function getSession(
  req: NextApiRequest
): Promise<Authentication> {
  const { authorization, ...headers } = req.headers;

  if (!authorization) return { loggedIn: false };

  const [_, token] = authorization?.split(" ");

  if (!token) return { loggedIn: false };

  const customTokenSignIn = await signInWithCustomToken(app.auth, token);
  const userIdToken = await customTokenSignIn.user.getIdToken();
  const decodedToken = await admin.auth.verifyIdToken(userIdToken);

  let userType: UserType;
  let data: Student | Professor | null;

  data = await prisma.student.findUnique({
    where: {
      id: decodedToken.uid,
    },
  });

  if (!data) {
    // Si anteriormente no encontro un usuario que sea estudiante
    // Lo vuelve a buscar pero como profesor
    data = await prisma.professor.findUnique({
      where: {
        id: decodedToken.uid,
      },
    });
    userType = UserType.PROFESSOR;
  } else {
    userType = UserType.STUDENT;
  }

  if (!data || !userType) return { loggedIn: false };

  return { loggedIn: true, data, userType };
}
