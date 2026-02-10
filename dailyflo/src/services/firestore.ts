import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type DocumentData
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Types
export interface JournalEntry {
  id?: string
  userId: string
  title: string
  content: string
  date: Date
  emotions: string[]
  imageUrl?: string
  cycleDay?: number
  cyclePhase?: string
  createdAt: Date
  updatedAt: Date
}

export interface CycleData {
  id?: string
  userId: string
  startDate: Date
  cycleLength: number
  periodLength: number
  notes?: string
  createdAt: Date
}

export interface SymptomLog {
  id?: string
  userId: string
  date: Date
  symptoms: string[]
  severity: { [symptom: string]: number }
  notes?: string
  mood?: string
  energyLevel?: number
  sleepQuality?: number
  createdAt: Date
}

// Helper to convert Firestore Timestamp to Date
const convertTimestamps = (data: DocumentData): DocumentData => {
  const result: DocumentData = {}
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      result[key] = data[key].toDate()
    } else {
      result[key] = data[key]
    }
  }
  return result
}

// Journal Entry Operations
export const journalService = {
  async create(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'journalEntries'), {
      ...entry,
      date: Timestamp.fromDate(entry.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  },

  async update(id: string, entry: Partial<JournalEntry>): Promise<void> {
    const docRef = doc(db, 'journalEntries', id)
    const updateData: DocumentData = {
      ...entry,
      updatedAt: Timestamp.now()
    }
    if (entry.date) {
      updateData.date = Timestamp.fromDate(entry.date)
    }
    await updateDoc(docRef, updateData)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'journalEntries', id))
  },

  async getById(id: string): Promise<JournalEntry | null> {
    const docSnap = await getDoc(doc(db, 'journalEntries', id))
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as JournalEntry
    }
    return null
  },

  async getByUser(userId: string): Promise<JournalEntry[]> {
    const q = query(
      collection(db, 'journalEntries'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as JournalEntry[]
  },

  async search(userId: string, searchTerm: string): Promise<JournalEntry[]> {
    // Firestore doesn't support full-text search, so we fetch all and filter client-side
    const entries = await this.getByUser(userId)
    const lowerSearch = searchTerm.toLowerCase()
    return entries.filter(
      entry =>
        entry.title.toLowerCase().includes(lowerSearch) ||
        entry.content.toLowerCase().includes(lowerSearch)
    )
  }
}

// Cycle Data Operations
export const cycleService = {
  async logPeriod(data: Omit<CycleData, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'cycleData'), {
      ...data,
      startDate: Timestamp.fromDate(data.startDate),
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async update(id: string, data: Partial<CycleData>): Promise<void> {
    const docRef = doc(db, 'cycleData', id)
    const updateData: DocumentData = { ...data }
    if (data.startDate) {
      updateData.startDate = Timestamp.fromDate(data.startDate)
    }
    await updateDoc(docRef, updateData)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'cycleData', id))
  },

  async getByUser(userId: string): Promise<CycleData[]> {
    const q = query(
      collection(db, 'cycleData'),
      where('userId', '==', userId),
      orderBy('startDate', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as CycleData[]
  },

  async getLatest(userId: string): Promise<CycleData | null> {
    const cycles = await this.getByUser(userId)
    return cycles.length > 0 ? cycles[0] : null
  }
}

// Symptom Log Operations
export const symptomService = {
  async log(data: Omit<SymptomLog, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'symptomLogs'), {
      ...data,
      date: Timestamp.fromDate(data.date),
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async update(id: string, data: Partial<SymptomLog>): Promise<void> {
    const docRef = doc(db, 'symptomLogs', id)
    const updateData: DocumentData = { ...data }
    if (data.date) {
      updateData.date = Timestamp.fromDate(data.date)
    }
    await updateDoc(docRef, updateData)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'symptomLogs', id))
  },

  async getByUser(userId: string): Promise<SymptomLog[]> {
    const q = query(
      collection(db, 'symptomLogs'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as SymptomLog[]
  },

  async getByDateRange(userId: string, startDate: Date, endDate: Date): Promise<SymptomLog[]> {
    const q = query(
      collection(db, 'symptomLogs'),
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as SymptomLog[]
  },

  async getForDate(userId: string, date: Date): Promise<SymptomLog | null> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const logs = await this.getByDateRange(userId, startOfDay, endOfDay)
    return logs.length > 0 ? logs[0] : null
  }
}
