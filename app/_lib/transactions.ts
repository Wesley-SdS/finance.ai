import { Transaction } from "@prisma/client";

interface SerializedTransaction {
  id: string;
  name: string;
  type: string;
  amount: string;
  category: string;
  paymentMethod: string;
  created: string;
  updateAt: string;
  date: string;
  userId: string;
}

export function serializeTransaction(
  transaction: Transaction,
): SerializedTransaction {
  return {
    ...transaction,
    amount: transaction.amount.toString(),
    created: transaction.created.toISOString(),
    updateAt: transaction.updateAt.toISOString(),
    date: transaction.date.toISOString(),
  };
}

export function serializeTransactions(
  transactions: Transaction[],
): SerializedTransaction[] {
  return transactions.map(serializeTransaction);
}
