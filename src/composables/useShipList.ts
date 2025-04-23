import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { Ship } from '@/types/interfaces'

export const useShipList = async (): Promise<Ship[]> => {
  const querySnapshot = await getDocs(collection(db, 'shiplist'))
  const ships: Ship[] = []
  querySnapshot.forEach((doc) => {
    ships.push({
      ...(doc.data() as Ship),
      id: Number(doc.id),
    })
  })
  return ships
}
