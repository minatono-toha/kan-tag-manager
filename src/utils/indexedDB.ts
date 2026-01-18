import { openDB, type IDBPDatabase, deleteDB } from 'idb'
import type { TagManagement, UserShip } from '@/types/interfaces'

const DEFAULT_DB_NAME = 'KanTagManagerDB'
const TAG_STORE_NAME = 'tagManagement'
const USER_SHIP_STORE_NAME = 'userShips'
const DB_VERSION = 7 // v7: Normalized schema with userShips

let dbPromise: Promise<IDBPDatabase> | null = null

// Get current active database name from localStorage
export function getActiveDBName(): string {
  return localStorage.getItem('kan-tag-active-db') || DEFAULT_DB_NAME
}

export function setActiveDBName(name: string) {
  localStorage.setItem('kan-tag-active-db', name)
}

export async function resetDBConnection() {
  if (dbPromise) {
    const db = await dbPromise
    db.close()
    dbPromise = null
  }
}

export async function initDB(): Promise<IDBPDatabase> {
  if (dbPromise) return dbPromise

  const dbName = getActiveDBName()

  dbPromise = openDB(dbName, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      console.log(`IndexedDB upgrade: v${oldVersion} -> v${newVersion}`)

      // v7: Normalize DB. Consolidated shipOwnership and shipVariant into userShips.
      // User requested NO MIGRATION, just reset/init.
      if (oldVersion < 7) {
        console.log('Upgrading to v7: Resetting and creating userShips store')

        // Delete deprecated stores
        const deprecatedStores = ['shipOwnership', 'shipVariant', 'externalMetadata']
        deprecatedStores.forEach(name => {
          if (db.objectStoreNames.contains(name)) {
            db.deleteObjectStore(name)
          }
        })

        // Create new userShips store
        if (!db.objectStoreNames.contains(USER_SHIP_STORE_NAME)) {
           db.createObjectStore(USER_SHIP_STORE_NAME, { keyPath: 'id' })
           // Indexes if needed?
        }
      }

      // Ensure tagManagement exists (v6 logic preserved but streamlined)
      if (!db.objectStoreNames.contains(TAG_STORE_NAME)) {
         const tagStore = db.createObjectStore(TAG_STORE_NAME, { keyPath: 'id' })
         tagStore.createIndex('eventId', 'eventId', { unique: false })
         tagStore.createIndex('eventId_orig_shipIndex', ['eventId', 'orig', 'shipIndex'], { unique: true })
      }

      console.log('IndexedDB initialization complete.')
    },
    blocked() {
      console.warn('IndexedDB upgrade blocked by another tab.')
      alert('他のタブで古いバージョンのサイトが開かれています。すべてのタブを閉じてからリロードしてください。')
    },
    blocking() {
      console.warn('IndexedDB upgrade blocking another tab.')
      dbPromise?.then(db => db.close()) // Close connection to allow upgrade
      dbPromise = null
    },
    terminated() {
      console.error('IndexedDB connection terminated unexpectedly.')
      dbPromise = null
    }
  })

  return dbPromise
}

export async function deleteDatabase(dbName: string): Promise<void> {
  await deleteDB(dbName)
}

// ===== User Ship Functions (New V7) =====

function generateUserShipId(orig: number, shipIndex: number): string {
  return `${orig}_${shipIndex}`
}

export async function saveUserShip(data: UserShip): Promise<void> {
  const db = await initDB()
  const dataWithId = {
    ...data,
    id: generateUserShipId(data.orig, data.shipIndex)
  }
  await db.put(USER_SHIP_STORE_NAME, dataWithId)
}

export async function getUserShip(orig: number, shipIndex: number): Promise<UserShip | null> {
  const db = await initDB()
  const id = generateUserShipId(orig, shipIndex)
  const result = await db.get(USER_SHIP_STORE_NAME, id)
  return result || null
}

export async function getAllUserShips(): Promise<UserShip[]> {
  const db = await initDB()
  return await db.getAll(USER_SHIP_STORE_NAME)
}

export async function deleteUserShip(orig: number, shipIndex: number): Promise<void> {
  const db = await initDB()
  const id = generateUserShipId(orig, shipIndex)
  await db.delete(USER_SHIP_STORE_NAME, id)
}


// ===== Tag Management Functions =====

function generateTagId(eventId: number, orig: number, shipIndex: number): string {
  return `${eventId}_${orig}_${shipIndex}`
}

export async function saveTagManagement(data: TagManagement): Promise<void> {
  const db = await initDB()
  const dataWithId = {
    ...data,
    id: generateTagId(data.eventId, data.orig, data.shipIndex)
  }
  await db.put(TAG_STORE_NAME, dataWithId)
}

export async function getTagManagement(
  eventId: number,
  orig: number,
  shipIndex: number
): Promise<TagManagement | null> {
  const db = await initDB()
  const id = generateTagId(eventId, orig, shipIndex)
  const result = await db.get(TAG_STORE_NAME, id)
  return result || null
}

export async function getTagManagementForShip(
  eventId: number,
  orig: number
): Promise<TagManagement[]> {
  const db = await initDB()
  const allRecords = await db.getAll(TAG_STORE_NAME)
  return allRecords.filter((record) => record.eventId === eventId && record.orig === orig)
}

export async function getAllTagManagementForEvent(eventId: number): Promise<TagManagement[]> {
  const db = await initDB()
  return await db.getAllFromIndex(TAG_STORE_NAME, 'eventId', eventId)
}

export async function getAllTagManagement(): Promise<TagManagement[]> {
  const db = await initDB()
  return await db.getAll(TAG_STORE_NAME)
}


export async function deleteTagManagement(
  eventId: number,
  orig: number,
  shipIndex: number
): Promise<void> {
  const db = await initDB()
  const id = generateTagId(eventId, orig, shipIndex)
  await db.delete(TAG_STORE_NAME, id)
}
