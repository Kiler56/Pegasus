// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { signInWithEmailAndPassword } from "firebase/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestMethods } from "../../../enum/RequestMethods";
import firebaseAdmin from "../../../libs/firebaseAdmin";
import firebaseApp from "../../../libs/firebaseApp";

type LoginResponse = {
  token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  const method = req.method;

  if (method !== RequestMethods.POST) return res.status(405);

  const { email, password } = req.body;

  const firebaseCredentials = await signInWithEmailAndPassword(
    firebaseApp.auth,
    email,
    password
  );

  const token = await firebaseAdmin.auth.createCustomToken(
    firebaseCredentials.user.uid
  );

  return res.status(200).json({ token });
}
