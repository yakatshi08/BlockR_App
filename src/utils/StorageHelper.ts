// src/utils/StorageHelper.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour la persistance
export interface ContactData {
  id: string;
  name: string;
  phone: string;
  isBlocked: boolean;
  dateBlocked?: string;
  callsBlocked?: number;
  messagesBlocked?: number;
}

export interface ScheduleRule {
  id: string;
  name: string;
  type: 'block' | 'allow';
  timeStart: string;
  timeEnd: string;
  days: string[];
  isActive: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoBlock: boolean;
  language: string;
}

// Clés de stockage
const STORAGE_KEYS = {
  CONTACTS: '@BlockR_contacts',
  SCHEDULE_RULES: '@BlockR_schedule_rules',
  PREFERENCES: '@BlockR_preferences',
  CALL_HISTORY: '@BlockR_call_history',
};

// ================================
// GESTION DES CONTACTS
// ================================

export const saveContacts = async (contacts: ContactData[]): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(contacts);
    await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, jsonValue);
    console.log('✅ Contacts sauvegardés avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde contacts:', error);
    return false;
  }
};

export const loadContacts = async (): Promise<ContactData[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (jsonValue !== null) {
      const contacts = JSON.parse(jsonValue);
      console.log(`✅ ${contacts.length} contacts chargés`);
      return contacts;
    }
    console.log('📝 Aucun contact sauvegardé, retour liste vide');
    return [];
  } catch (error) {
    console.error('❌ Erreur chargement contacts:', error);
    return [];
  }
};

export const addOrUpdateContact = async (contact: ContactData): Promise<boolean> => {
  try {
    const contacts = await loadContacts();
    const existingIndex = contacts.findIndex(c => c.id === contact.id);
    
    if (existingIndex >= 0) {
      // Mise à jour contact existant
      contacts[existingIndex] = contact;
      console.log(`📝 Contact mis à jour: ${contact.name}`);
    } else {
      // Nouveau contact
      contacts.push(contact);
      console.log(`➕ Nouveau contact ajouté: ${contact.name}`);
    }
    
    return await saveContacts(contacts);
  } catch (error) {
    console.error('❌ Erreur ajout/mise à jour contact:', error);
    return false;
  }
};

export const deleteContact = async (contactId: string): Promise<boolean> => {
  try {
    const contacts = await loadContacts();
    const filteredContacts = contacts.filter(c => c.id !== contactId);
    console.log(`🗑️ Contact supprimé: ${contactId}`);
    return await saveContacts(filteredContacts);
  } catch (error) {
    console.error('❌ Erreur suppression contact:', error);
    return false;
  }
};

export const toggleContactBlock = async (contactId: string, isBlocked: boolean): Promise<boolean> => {
  try {
    const contacts = await loadContacts();
    const contact = contacts.find(c => c.id === contactId);
    
    if (contact) {
      contact.isBlocked = isBlocked;
      if (isBlocked && !contact.dateBlocked) {
        contact.dateBlocked = new Date().toISOString();
      }
      console.log(`🚫 Contact ${isBlocked ? 'bloqué' : 'débloqué'}: ${contact.name}`);
      return await saveContacts(contacts);
    }
    return false;
  } catch (error) {
    console.error('❌ Erreur toggle contact:', error);
    return false;
  }
};

// ================================
// GESTION DES RÈGLES DE PLANNING
// ================================

export const saveScheduleRules = async (rules: ScheduleRule[]): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(rules);
    await AsyncStorage.setItem(STORAGE_KEYS.SCHEDULE_RULES, jsonValue);
    console.log('✅ Règles de planning sauvegardées');
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde règles:', error);
    return false;
  }
};

export const loadScheduleRules = async (): Promise<ScheduleRule[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULE_RULES);
    if (jsonValue !== null) {
      const rules = JSON.parse(jsonValue);
      console.log(`✅ ${rules.length} règles de planning chargées`);
      return rules;
    }
    return [];
  } catch (error) {
    console.error('❌ Erreur chargement règles:', error);
    return [];
  }
};

// ================================
// GESTION DES PRÉFÉRENCES
// ================================

export const savePreferences = async (preferences: UserPreferences): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(preferences);
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, jsonValue);
    console.log('✅ Préférences sauvegardées');
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde préférences:', error);
    return false;
  }
};

export const loadPreferences = async (): Promise<UserPreferences> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (jsonValue !== null) {
      const preferences = JSON.parse(jsonValue);
      console.log('✅ Préférences chargées');
      return preferences;
    }
    // Préférences par défaut
    return {
      theme: 'light',
      notifications: true,
      autoBlock: false,
      language: 'fr',
    };
  } catch (error) {
    console.error('❌ Erreur chargement préférences:', error);
    return {
      theme: 'light',
      notifications: true,
      autoBlock: false,
      language: 'fr',
    };
  }
};

// ================================
// UTILITAIRES
// ================================

export const clearAllData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CONTACTS,
      STORAGE_KEYS.SCHEDULE_RULES,
      STORAGE_KEYS.PREFERENCES,
      STORAGE_KEYS.CALL_HISTORY,
    ]);
    console.log('🗑️ Toutes les données effacées');
    return true;
  } catch (error) {
    console.error('❌ Erreur effacement données:', error);
    return false;
  }
};

export const getStorageSize = async (): Promise<number> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);
    let totalSize = 0;
    
    stores.forEach(([key, value]) => {
      if (key.startsWith('@BlockR_')) {
        totalSize += (value?.length || 0);
      }
    });
    
    console.log(`📊 Taille stockage BlockR: ${totalSize} caractères`);
    return totalSize;
  } catch (error) {
    console.error('❌ Erreur calcul taille:', error);
    return 0;
  }
};