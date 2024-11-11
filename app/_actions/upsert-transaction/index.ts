"use server";

import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { upsertTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  // Validar os parâmetros
  upsertTransactionSchema.parse(params);

  // Obter a sessão do usuário usando NextAuth
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Inserir ou atualizar a transação
  const transaction = await db.transaction.upsert({
    update: {
      ...params,
      userId,
      updateAt: new Date(),
      type: params.type as TransactionType,
      category: params.category as TransactionCategory,
      paymentMethod: params.paymentMethod as TransactionPaymentMethod,
    },
    create: {
      ...params,
      userId,
      created: new Date(),
      type: params.type as TransactionType,
      category: params.category as TransactionCategory,
      paymentMethod: params.paymentMethod as TransactionPaymentMethod,
    },
    where: {
      id: params?.id ?? "",
    },
  });

  // Revalidar o cache da página de transações
  revalidatePath("/transactions");

  // Converter o valor Decimal para string antes de retornar
  return {
    ...transaction,
    amount: transaction.amount.toString(),
  };
};
