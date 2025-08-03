import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Q } from '@nozbe/watermelondb'
import { useMemo, useState, useEffect } from 'react'
import { Transaction } from '../../database/models'

export interface TransactionFilters {
  isPersonal?: boolean | null
  date?: Date | null
  type?: 'expense' | 'income' | 'transfer' | null
}

export interface TransactionData {
  id: string
  title: string
  amount: number
  currency: string
  date: number
  groupName?: string
  subcategoryName?: string
  subcategoryIcon?: string
  type: string
  tagNames?: string[]
}

export const useTransactions = (filters: TransactionFilters = {}) => {
  const database = useDatabase()
  
  const query = useMemo(() => {
    if (!database) return null

    try {
      const baseQuery = database.collections.get('transactions').query()

      // Apply filters
      if (filters.isPersonal !== null && filters.isPersonal !== undefined) {
        baseQuery.extend(Q.where('is_personal', filters.isPersonal))
      }

      if (filters.type !== null && filters.type !== undefined) {
        baseQuery.extend(Q.where('type', filters.type))
      }

      if (filters.date !== null && filters.date !== undefined) {
        const startOfDay = new Date(filters.date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(filters.date)
        endOfDay.setHours(23, 59, 59, 999)
        
        baseQuery.extend(
          Q.and(
            Q.where('date', Q.gte(startOfDay.getTime())),
            Q.where('date', Q.lte(endOfDay.getTime()))
          )
        )
      }

      // Sort by date (newest first)
      baseQuery.extend(Q.sortBy('date', Q.desc))

      return baseQuery
    } catch (error) {
      console.error('Error creating query:', error)
      return null
    }
  }, [database, filters.isPersonal, filters.type, filters.date])

  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!query) {
      setTransactions([])
      return
    }

    const subscription = query.observe().subscribe((data) => {
      setTransactions(data as Transaction[])
    })

    return () => subscription.unsubscribe()
  }, [query])

  const formattedTransactions = useMemo(() => {
    return transactions.map((transaction: Transaction) => {
      try {
        const group = transaction.group
        const subcategory = transaction.subcategory

        // Get tag names from transaction tags - this should work like group/subcategory
        const tagNames: string[] = []
        
        // Access transaction tags and their related tags
        if (transaction.transactionTags && transaction.transactionTags.length > 0) {
          // This should work the same way as group and subcategory
          // transactionTags is a collection of TransactionTag models
          // Each TransactionTag has a tag relationship
          for (const transactionTag of transaction.transactionTags) {
            if (transactionTag.tag && transactionTag.tag.name) {
              tagNames.push(transactionTag.tag.name)
            }
          }
        }

        return {
          id: transaction.id,
          title: transaction.title,
          amount: transaction.amount,
          currency: transaction.currency,
          date: transaction.date,
          type: transaction.type,
          groupName: group?.title || undefined,
          subcategoryName: subcategory?.name || undefined,
          subcategoryIcon: subcategory?.icon || '💶',
          tagNames: tagNames.length > 0 ? tagNames : undefined
        }
      } catch (error) {
        console.error('Error formatting transaction:', error)
        return null
      }
    }).filter(Boolean) as TransactionData[]
  }, [transactions])

  const totalExpenses = useMemo(() => {
    return formattedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [formattedTransactions])

  const totalIncome = useMemo(() => {
    return formattedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [formattedTransactions])

  return {
    transactions: formattedTransactions,
    totalExpenses,
    totalIncome,
    isLoading: !database
  }
} 