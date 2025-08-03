import { Database } from '@nozbe/watermelondb'
import { isDatabaseSeeded, setDatabaseSeeded } from '../../hooks/usePreference'
import { seedUsers } from './users'
import { seedCategories } from './categories'
import { seedSubcategories } from './subcategories'
import { seedTags } from './tags'
import { seedGroups } from './groups'
import { seedTransactions } from './transactions'

/**
 * Seed the database with initial data
 */
export const seedDatabase = async (db: Database): Promise<void> => {
  try {
    console.log('🌱 Checking if database needs seeding...')
    
    // Check if database is already seeded using AsyncStorage flag
    const isSeeded = await isDatabaseSeeded()
    if (isSeeded) {
      console.log('✅ Database already seeded, skipping seed')
      return
    }
    
    console.log('🌱 Seeding database with initial data...')
    
    await db.write(async () => {
      // 1. Create users
      console.log('👥 Creating users...')
      const createdUsers = await Promise.all(
        seedUsers.map(userData =>
          db.collections.get('users').create((user: any) => {
            user.uuid = userData.uuid
            user.name = userData.name
            user.nickname = userData.nickname
            user.email = userData.email
            user.avatar = userData.avatar
          })
        )
      )
      console.log(`✅ Created ${createdUsers.length} users`)
      
      // 2. Create categories
      console.log('📂 Creating categories...')
      const createdCategories = await Promise.all(
        seedCategories.map(categoryData =>
          db.collections.get('categories').create((category: any) => {
            category.name = categoryData.name
            category.type = categoryData.type
          })
        )
      )
      console.log(`✅ Created ${createdCategories.length} categories`)
      
      // 3. Create subcategories (with category relationships)
      console.log('📁 Creating subcategories...')
      const categoryMap = new Map()
      createdCategories.forEach((category: any) => {
        categoryMap.set(category.name, category.id)
      })
      
      const createdSubcategories = await Promise.all(
        seedSubcategories.map(subcategoryData => {
          const categoryId = categoryMap.get(subcategoryData.categoryName)
          if (!categoryId) {
            throw new Error(`Category not found: ${subcategoryData.categoryName}`)
          }
          
          return db.collections.get('subcategories').create((subcategory: any) => {
            subcategory.name = subcategoryData.name
            subcategory.type = subcategoryData.type
            subcategory.icon = subcategoryData.icon
            subcategory.categoryId = categoryId
          })
        })
      )
      console.log(`✅ Created ${createdSubcategories.length} subcategories`)
      
      // 4. Create tags
      console.log('🏷️ Creating tags...')
      const createdTags = await Promise.all(
        seedTags.map(tagData =>
          db.collections.get('tags').create((tag: any) => {
            tag.name = tagData.name
          })
        )
      )
      console.log(`✅ Created ${createdTags.length} tags`)
      
      // 5. Create groups
      console.log('👥 Creating groups...')
      const createdGroups = await Promise.all(
        seedGroups.map(groupData =>
          db.collections.get('groups').create((group: any) => {
            group.title = groupData.title
            group.icon = groupData.icon
            group.currency = groupData.currency
          })
        )
      )
      console.log(`✅ Created ${createdGroups.length} groups`)
      
      // 6. Create participants (link all users to both groups)
      console.log('👤 Creating participants...')
      const allParticipants = []
      
      for (const group of createdGroups) {
        for (const user of createdUsers) {
          const participant = await db.collections.get('participants').create((participant: any) => {
            participant.groupId = group.id
            participant.userId = user.id
            participant.isActive = true
            participant.displayName = (user as any).nickname || (user as any).name
          })
          allParticipants.push(participant)
        }
      }
      console.log(`✅ Created ${allParticipants.length} participants`)
      
      // 7. Create transactions
      console.log('💰 Creating transactions...')
      
      // Create maps for lookups
      const subcategoryMap = new Map()
      createdSubcategories.forEach((subcategory: any) => {
        subcategoryMap.set(subcategory.name, subcategory.id)
      })
      
      const tagMap = new Map()
      createdTags.forEach((tag: any) => {
        tagMap.set(tag.name, tag.id)
      })
      
      const groupMap = new Map()
      createdGroups.forEach((group: any) => {
        groupMap.set(group.title, group.id)
      })
      
      const userMap = new Map()
      createdUsers.forEach((user: any) => {
        userMap.set(user.name, user.id)
      })
      
      // Create transactions
      const createdTransactions = await Promise.all(
        seedTransactions.map(async (transactionData) => {
          // Find subcategory
          const subcategoryId = subcategoryMap.get(transactionData.subcategoryName)
          if (!subcategoryId) {
            throw new Error(`Subcategory not found: ${transactionData.subcategoryName}`)
          }
          
          // Find group if it's a group transaction
          let groupId = null
          if (!transactionData.isPersonal) {
            groupId = groupMap.get(transactionData.groupTitle)
            if (!groupId) {
              throw new Error(`Group not found: ${transactionData.groupTitle}`)
            }
          }
          
          // Create transaction
          const transaction = await db.collections.get('transactions').create((transaction: any) => {
            transaction.title = transactionData.title
            transaction.amount = transactionData.amount
            transaction.currency = transactionData.currency
            transaction.date = transactionData.date
            transaction.isPersonal = transactionData.isPersonal
            transaction.groupId = groupId
            transaction.subcategoryId = subcategoryId
          })
          
          // Create transaction payers
          await Promise.all(
            transactionData.payers.map(async (payerData) => {
              const userId = userMap.get(payerData.userName)
              if (!userId) {
                throw new Error(`User not found: ${payerData.userName}`)
              }
              
              await db.collections.get('transaction_payers').create((payer: any) => {
                payer.transactionId = transaction.id
                payer.userId = userId
                payer.amount = payerData.amount
              })
            })
          )
          
          // Create transaction tags
          await Promise.all(
            transactionData.tags.map(async (tagName) => {
              const tagId = tagMap.get(tagName)
              if (!tagId) {
                throw new Error(`Tag not found: ${tagName}`)
              }
              
              await db.collections.get('transaction_tags').create((transactionTag: any) => {
                transactionTag.transactionId = transaction.id
                transactionTag.tagId = tagId
              })
            })
          )
          
          return transaction
        })
      )
      console.log(`✅ Created ${createdTransactions.length} transactions`)
    })
    
    // Mark database as seeded in AsyncStorage
    await setDatabaseSeeded(true)
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  }
} 