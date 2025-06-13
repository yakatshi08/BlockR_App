import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';

// Import des fonctions de stockage
import {
  ContactData,
  loadContacts,
  addOrUpdateContact,
} from './src/utils/StorageHelper';

// Import du nouveau composant de blocage
import AppBlockerScreen from './src/screens/AppBlockerScreen';

// Types pour les données
interface Contact {
  id: string;
  name: string;
  phone: string;
  isBlocked: boolean;
  callsBlocked?: number;
  messagesBlocked?: number;
  dateBlocked?: string;
}

// Type pour les traductions
type Language = 'fr' | 'en';

// Objet de traductions
const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    contacts: 'Contacts',
    blacklist: 'Liste noire',
    schedule: 'Planning',
    settings: 'Paramètres',
    
    // Écran d'accueil
    appTitle: 'BlockR',
    appSubtitle: 'Votre protection contre les appels indésirables',
    blockedContacts: 'Contacts bloqués',
    blockedToday: 'Bloqués aujourd\'hui',
    activeRules: 'Règles actives',
    quickActions: 'Actions rapides',
    addNumber: '📱 Ajouter un numéro',
    newRule: '📅 Nouvelle règle',
    viewActivity: '📊 Voir l\'activité récente',
    recentActivity: 'Activité récente',
    
    // Écran Contacts
    back: '← Retour',
    searchPlaceholder: '🔍 Rechercher un contact...',
    activeContact: 'Contact actif',
    block: 'Bloquer',
    unblock: 'Débloquer',
    addNewContact: '📱 Ajouter un nouveau contact',
    namePlaceholder: '👤 Nom complet (ex: Jean Dupont)',
    phonePlaceholder: '📞 Numéro de téléphone (ex: 06 12 34 56 78)',
    cancel: '❌ Annuler',
    save: '✅ Enregistrer',
    newContact: '+ Nouveau contact',
    noContactFound: 'Aucun contact trouvé',
    noContactForSearch: 'Aucun contact ne correspond à',
    noContacts: 'Aucun contact',
    startAddingContacts: 'Commencez par ajouter votre premier contact',
    contactAdded: 'Contact ajouté ✅',
    addedSuccessfully: 'a été ajouté avec succès !',
    error: 'Erreur ❌',
    fillAllFields: 'Veuillez remplir tous les champs',
    blockContact: '🔒 Bloquer contact',
    unblockContact: '🔒 Débloquer contact',
    confirmBlock: 'Êtes-vous sûr de vouloir bloquer',
    confirmUnblock: 'Êtes-vous sûr de vouloir débloquer',
    canCallAgain: '✅ Ce contact pourra à nouveau vous appeler',
    cannotCall: '🚫 Ce contact ne pourra plus vous appeler',
    
    // Écran Liste noire
    blockedSince: 'Bloqué depuis:',
    callsBlocked: 'Appels bloqués',
    smsBlocked: 'SMS bloqués',
    
    // Écran Planning
    scheduleInfo: 'Programmez des règles de blocage automatiques selon vos horaires',
    workHours: 'Heures de travail',
    quietNight: 'Nuit tranquille',
    weekendRelax: 'Weekend relax',
    allow: '✅ Autoriser',
    blockAction: '🚫 Bloquer',
    inactive: ' (inactif)',
    ruleActivated: 'activée',
    ruleDeactivated: 'désactivée',
    rule: 'Règle',
    
    // Écran Paramètres
    userProfile: 'Utilisateur BlockR',
    protectionActive: 'Protection active',
    blocking: 'Blocage',
    blockUnknown: 'Bloquer numéros inconnus',
    blockUnknownDesc: 'Bloquer automatiquement les appels de numéros non enregistrés',
    blockInternational: 'Bloquer appels internationaux',
    blockInternationalDesc: 'Bloquer les appels provenant de l\'étranger',
    notifications: 'Notifications',
    notificationsDesc: 'Recevoir des notifications d\'appels bloqués',
    appearance: 'Apparence',
    darkMode: 'Mode sombre',
    darkModeDesc: 'Utiliser le thème sombre',
    language: 'Langue',
    languageDesc: 'Choisir la langue de l\'application',
    about: 'À propos',
    aboutBlockR: 'À propos de BlockR',
    version: 'Version 1.0.0\nDéveloppé avec React Native',
    
    // Jours de la semaine
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mer',
    thu: 'Jeu',
    fri: 'Ven',
    sat: 'Sam',
    sun: 'Dim',
    
    // Messages d'activité
    blockedCall: '🚫 Appel bloqué:',
    blockedSMS: '🚫 SMS bloqué:',
    ago2h: '(il y a 2h)',
    ago5h: '(il y a 5h)',
    yesterday: '(hier)',
    todayTotal: '✅ Total aujourd\'hui: 3 appels bloqués',
  },
  en: {
    // Navigation
    home: 'Home',
    contacts: 'Contacts',
    blacklist: 'Blacklist',
    schedule: 'Schedule',
    settings: 'Settings',
    
    // Home screen
    appTitle: 'BlockR',
    appSubtitle: 'Your protection against unwanted calls',
    blockedContacts: 'Blocked contacts',
    blockedToday: 'Blocked today',
    activeRules: 'Active rules',
    quickActions: 'Quick actions',
    addNumber: '📱 Add a number',
    newRule: '📅 New rule',
    viewActivity: '📊 View recent activity',
    recentActivity: 'Recent activity',
    
    // Contacts screen
    back: '← Back',
    searchPlaceholder: '🔍 Search contacts...',
    activeContact: 'Active contact',
    block: 'Block',
    unblock: 'Unblock',
    addNewContact: '📱 Add new contact',
    namePlaceholder: '👤 Full name (e.g. John Doe)',
    phonePlaceholder: '📞 Phone number (e.g. 06 12 34 56 78)',
    cancel: '❌ Cancel',
    save: '✅ Save',
    newContact: '+ New contact',
    noContactFound: 'No contact found',
    noContactForSearch: 'No contact matches',
    noContacts: 'No contacts',
    startAddingContacts: 'Start by adding your first contact',
    contactAdded: 'Contact added ✅',
    addedSuccessfully: 'has been added successfully!',
    error: 'Error ❌',
    fillAllFields: 'Please fill all fields',
    blockContact: '🔒 Block contact',
    unblockContact: '🔒 Unblock contact',
    confirmBlock: 'Are you sure you want to block',
    confirmUnblock: 'Are you sure you want to unblock',
    canCallAgain: '✅ This contact will be able to call you again',
    cannotCall: '🚫 This contact will no longer be able to call you',
    
    // Blacklist screen
    blockedSince: 'Blocked since:',
    callsBlocked: 'Calls blocked',
    smsBlocked: 'SMS blocked',
    
    // Schedule screen
    scheduleInfo: 'Schedule automatic blocking rules according to your hours',
    workHours: 'Work hours',
    quietNight: 'Quiet night',
    weekendRelax: 'Weekend relax',
    allow: '✅ Allow',
    blockAction: '🚫 Block',
    inactive: ' (inactive)',
    ruleActivated: 'activated',
    ruleDeactivated: 'deactivated',
    rule: 'Rule',
    
    // Settings screen
    userProfile: 'BlockR User',
    protectionActive: 'Protection active',
    blocking: 'Blocking',
    blockUnknown: 'Block unknown numbers',
    blockUnknownDesc: 'Automatically block calls from unregistered numbers',
    blockInternational: 'Block international calls',
    blockInternationalDesc: 'Block calls from abroad',
    notifications: 'Notifications',
    notificationsDesc: 'Receive notifications of blocked calls',
    appearance: 'Appearance',
    darkMode: 'Dark mode',
    darkModeDesc: 'Use dark theme',
    language: 'Language',
    languageDesc: 'Choose app language',
    about: 'About',
    aboutBlockR: 'About BlockR',
    version: 'Version 1.0.0\nDeveloped with React Native',
    
    // Days of the week
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
    
    // Activity messages
    blockedCall: '🚫 Blocked call:',
    blockedSMS: '🚫 Blocked SMS:',
    ago2h: '(2h ago)',
    ago5h: '(5h ago)',
    yesterday: '(yesterday)',
    todayTotal: '✅ Today\'s total: 3 blocked calls',
  }
};

const App = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<Language>('fr');
  
  // États pour le formulaire d'ajout de contact
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  // Fonction pour obtenir la traduction
  const t = (key: keyof typeof translations.fr): string => {
    return translations[language][key] || key;
  };

  // Fonction pour formater le nom avec majuscule
  const formatName = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fonction pour formater le numéro de téléphone
  const formatPhoneNumber = (phone: string): string => {
    // Supprimer tous les caractères non numériques sauf le +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Si le numéro commence par +33
    if (cleaned.startsWith('+33')) {
      cleaned = cleaned.substring(3);
      const matches = cleaned.match(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/);
      if (matches) {
        return `+33 ${matches[1]} ${matches[2]} ${matches[3]} ${matches[4]} ${matches[5]}`;
      }
    }
    // Si le numéro commence par 0
    else if (cleaned.startsWith('0')) {
      const matches = cleaned.match(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
      if (matches) {
        return `${matches[1]} ${matches[2]} ${matches[3]} ${matches[4]} ${matches[5]}`;
      }
    }
    
    return phone; // Retourner le numéro original si pas de format reconnu
  };

  // Données de test avec formats corrigés
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Alice Martin', phone: '+33 6 12 34 56 78', isBlocked: false },
    { id: '2', name: 'Bob Dupont', phone: '+33 6 98 76 54 32', isBlocked: true },
    { id: '3', name: 'Claire Durand', phone: '+33 7 11 22 33 44', isBlocked: false },
    { id: '4', name: 'David Moreau', phone: '+33 6 55 66 77 88', isBlocked: false },
    { id: '5', name: 'Beros', phone: '06 99 88 55 63', isBlocked: true },
  ]);

  const [blockedContacts] = useState<BlockedContact[]>([
    { id: '1', name: 'Spam Télécom', phone: '+33 8 99 99 99 99', blockedDate: '15 Jan 2024', callsBlocked: 23, messagesBlocked: 5 },
    { id: '2', name: 'Bob Dupont', phone: '+33 6 98 76 54 32', blockedDate: '20 Fév 2024', callsBlocked: 7, messagesBlocked: 12 },
    { id: '3', name: 'Marketing Pro', phone: '+33 1 23 45 67 89', blockedDate: '10 Mar 2024', callsBlocked: 45, messagesBlocked: 0 },
  ]);

  const [scheduleRules, setScheduleRules] = useState<ScheduleRule[]>([
    { id: '1', name: t('workHours'), startTime: '09:00', endTime: '18:00', days: [t('mon'), t('tue'), t('wed'), t('thu'), t('fri')], isActive: true, type: 'allow' },
    { id: '2', name: t('quietNight'), startTime: '22:00', endTime: '07:00', days: [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')], isActive: true, type: 'block' },
    { id: '3', name: t('weekendRelax'), startTime: '10:00', endTime: '20:00', days: [t('sat'), t('sun')], isActive: false, type: 'allow' },
  ]);

  const [settings, setSettings] = useState({
    blockUnknown: true,
    blockInternational: false,
    notifications: true,
    darkMode: false,
  });
  // ================================
  // CHARGEMENT INITIAL DES DONNÉES
  // ================================
  
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Chargement des contacts...');
      
      // Charger contacts depuis AsyncStorage
      const savedContacts = await loadContacts();
      setContacts(savedContacts);
      
      console.log(`✅ ${savedContacts.length} contacts chargés`);
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      // En cas d'erreur, on continue avec une liste vide
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ================================
  // FONCTION POUR AJOUTER UN CONTACT DE TEST
  // ================================
  
  const addTestContact = async () => {
    const testContact: Contact = {
      id: Date.now().toString(),
      name: `Contact Test ${contacts.length + 1}`,
      phone: `+33 6 ${Math.floor(Math.random() * 90000000) + 10000000}`,
      isBlocked: Math.random() > 0.5,
      callsBlocked: Math.floor(Math.random() * 10),
      messagesBlocked: Math.floor(Math.random() * 5),
      dateBlocked: new Date().toISOString(),
    };

    try {
      // Sauvegarder en AsyncStorage
      const success = await addOrUpdateContact(testContact);
      
      if (success) {
        // Mettre à jour l'état local
        setContacts(prev => [...prev, testContact]);
        Alert.alert(
          'Succès !', 
          `Contact "${testContact.name}" ajouté et sauvegardé !\n\n` +
          `📱 ${testContact.phone}\n` +
          `🚫 ${testContact.isBlocked ? 'Bloqué' : 'Non bloqué'}\n` +
          `📞 ${testContact.callsBlocked} appels bloqués`
        );
      } else {
        Alert.alert('Erreur', 'Impossible de sauvegarder le contact');
      }
    } catch (error) {
      console.error('❌ Erreur ajout contact:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout');
    }
  };

  // ================================
  // FONCTION POUR AJOUTER UN CONTACT MANUEL
  // ================================

  const addManualContact = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const manualContact: Contact = {
      id: Date.now().toString(),
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
      isBlocked: false,
      callsBlocked: 0,
      messagesBlocked: 0,
      dateBlocked: new Date().toISOString(),
    };

    try {
      const success = await addOrUpdateContact(manualContact);
      
      if (success) {
        setContacts(prev => [...prev, manualContact]);
        setNewContact({ name: '', phone: '' });
        setShowAddForm(false);
        Alert.alert(
          'Contact ajouté !',
          `"${manualContact.name}" a été ajouté à vos contacts.\n\nTéléphone: ${manualContact.phone}`
        );
      } else {
        Alert.alert('Erreur', 'Impossible de sauvegarder le contact');
      }
    } catch (error) {
      console.error('❌ Erreur ajout contact manuel:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout');
    }
  };

  // ================================
  // STATISTIQUES CALCULÉES
  // ================================

  const getStats = () => {
    const blockedContacts = contacts.filter(c => c.isBlocked).length;
    const totalCallsBlocked = contacts.reduce((sum, c) => sum + (c.callsBlocked || 0), 0);
    const totalMessagesBlocked = contacts.reduce((sum, c) => sum + (c.messagesBlocked || 0), 0);

    return {
      totalContacts: contacts.length,
      blockedContacts,
      totalCallsBlocked,
      totalMessagesBlocked,
    };
  };

  // ================================
  // FONCTION POUR AFFICHER LES STATISTIQUES
  // ================================

  const showStatistics = () => {
    try {
      const stats = getStats();
      console.log('📊 Affichage des statistiques:', stats);
      
      Alert.alert(
        '📊 Statistiques BlockR',
        `Voici un résumé complet de votre protection :\n\n` +
        `👥 Total contacts : ${stats.totalContacts}\n` +
        `🚫 Contacts bloqués : ${stats.blockedContacts}\n` +
        `📞 Appels bloqués : ${stats.totalCallsBlocked}\n` +
        `💬 SMS bloqués : ${stats.totalMessagesBlocked}\n\n` +
        `💾 Toutes vos données sont sauvegardées automatiquement !`,
        [
          { text: 'Fermer', style: 'cancel' },
          { 
            text: 'Voir les contacts', 
            onPress: () => {
              console.log('Navigation vers contacts');
              setCurrentTab('contacts');
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erreur affichage statistiques:', error);
      Alert.alert('Test', 'Bouton statistiques cliqué ! (Mode debug)');
    }
  };

  const tabs = [
    { id: 'home', label: t('home'), icon: '🏠' },
    { id: 'contacts', label: t('contacts'), icon: '👥' },
    { id: 'blacklist', label: t('blacklist'), icon: '🚫' },
    { id: 'schedule', label: t('schedule'), icon: '📅' },
    { id: 'settings', label: t('settings'), icon: '⚙️' },
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'contacts', label: 'Contacts', icon: '📱' },
    { id: 'blacklist', label: 'Liste noire', icon: '🚫' },
    { id: 'appblocker', label: 'Blocage Apps', icon: '🔒' },
    { id: 'schedule', label: 'Planning', icon: '📅' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
  ];

  // Écran d'accueil
  const renderHomeScreen = () => (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('appTitle')}</Text>
        <Text style={styles.headerSubtitle}>{t('appSubtitle')}</Text>
      </View>
  const renderHomeScreen = () => {
    const stats = getStats();

    return (
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BlockR</Text>
          <Text style={styles.headerSubtitle}>Votre protection contre les appels indésirables</Text>
        </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>{t('blockedContacts')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>{t('blockedToday')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>{t('activeRules')}</Text>
        </View>
      </View>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.blockedContacts}</Text>
            <Text style={styles.statLabel}>Contacts bloqués</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalCallsBlocked}</Text>
            <Text style={styles.statLabel}>Appels bloqués</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Règles actives</Text>
          </View>
        </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentTab('contacts')}
        >
          <Text style={styles.actionText}>{t('addNumber')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentTab('schedule')}
        >
          <Text style={styles.actionText}>{t('newRule')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert(t('recentActivity'), 
            `${t('blockedCall')} +33 6 12 34 56 78 ${t('ago2h')}\n${t('blockedSMS')} +33 8 99 99 99 99 ${t('ago5h')}\n${t('blockedCall')} Marketing Pro ${t('yesterday')}\n${t('blockedCall')} Spam Télécom ${t('yesterday')}\n\n${t('todayTotal')}`
          )}
        >
          <Text style={styles.actionText}>{t('viewActivity')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Écran Contacts
  const renderContactsScreen = () => {
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    );

    // Logique pour l'affichage du bouton
    const hasSearchQuery = searchQuery.trim().length > 0;
    const hasResults = filteredContacts.length > 0;
    const showAddButton = !hasSearchQuery || !hasResults;

    const handleAddContact = () => {
      if (newContact.name.trim() && newContact.phone.trim()) {
        const newId = (contacts.length + 1).toString();
        const contactToAdd = {
          id: newId,
          name: formatName(newContact.name.trim()),
          phone: formatPhoneNumber(newContact.phone.trim()),
          isBlocked: false
        };
        
        setContacts(prev => [...prev, contactToAdd]);
        
        Alert.alert(
          t('contactAdded'),
          `${contactToAdd.name} ${t('addedSuccessfully')}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setNewContact({ name: '', phone: '' });
                setShowAddForm(false);
                setSearchQuery('');
              }
            }
          ]
        );
      } else {
        Alert.alert(t('error'), t('fillAllFields'));
      }
    };

    const handleToggleBlock = (contact: Contact) => {
      const action = contact.isBlocked ? t('unblock').toLowerCase() : t('block').toLowerCase();
      const title = contact.isBlocked ? t('unblockContact') : t('blockContact');
      const question = contact.isBlocked ? t('confirmUnblock') : t('confirmBlock');
      const consequence = contact.isBlocked ? t('canCallAgain') : t('cannotCall');
      
      Alert.alert(
        title,
        `${question} ${contact.name} ?\n\n${consequence}`,
        [
          { 
            text: t('cancel'), 
            style: 'cancel' 
          },
          {
            text: contact.isBlocked ? t('unblock') : t('block'),
            style: contact.isBlocked ? 'default' : 'destructive',
            onPress: () => {
              setContacts(prev =>
                prev.map(c =>
                  c.id === contact.id ? { ...c, isBlocked: !c.isBlocked } : c
                )
              );
            }
          }
        ]
      );
    };

    const ContactItem = ({ item }: { item: Contact }) => (
      <View style={[styles.contactCard, item.isBlocked && styles.contactCardBlocked]}>
        <View style={styles.contactInfo}>
          <View style={[styles.avatar, { backgroundColor: item.isBlocked ? '#f44336' : '#2196F3' }]}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.contactDetails}>
            <View style={styles.contactNameRow}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.lockIcon}>
                {item.isBlocked ? '🔒' : '🔓'}
              </Text>
            </View>
            <Text style={styles.contactPhone}>{item.phone}</Text>
            {!item.isBlocked && (
              <Text style={styles.contactStatus}>{t('activeContact')}</Text>
            )}
          </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setCurrentTab('contacts')}
          >
            <Text style={styles.actionText}>📱 Voir les contacts ({stats.totalContacts})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setCurrentTab('blacklist')}
          >
            <Text style={styles.actionText}>🚫 Liste noire ({stats.blockedContacts})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => showStatistics()}
          >
            <Text style={styles.actionText}>📊 Voir les statistiques</Text>
          </TouchableOpacity>
          {/* NOUVEAU BOUTON POUR LE BLOCAGE D'APPS */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#ff4444' }]}
            onPress={() => setCurrentTab('appblocker')}
          >
            <Text style={[styles.actionText, { color: 'white' }]}>🔒 Bloquer des Applications</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.blockButton, { backgroundColor: item.isBlocked ? '#4caf50' : '#f44336' }]}
          onPress={() => handleToggleBlock(item)}
        >
          <Text style={styles.blockButtonText}>{item.isBlocked ? t('unblock') : t('block')}</Text>
        </TouchableOpacity>
      </View>
    );

    const renderEmptyState = () => {
      if (hasSearchQuery && !hasResults) {
        return (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>{t('noContactFound')}</Text>
            <Text style={styles.emptyStateSubtitle}>
              {t('noContactForSearch')} "{searchQuery}"

        {/* Section de test AsyncStorage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Test AsyncStorage</Text>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={addTestContact}
          >
            <Text style={styles.testButtonText}>+ Ajouter un contact de test</Text>
          </TouchableOpacity>
          <Text style={styles.testInfo}>
            Ceci ajoute un contact aléatoire et le sauvegarde.{'\n'}
            Redémarrez l'app pour vérifier la persistance !
          </Text>
        </View>

        {/* Indicateur de persistance */}
        <View style={styles.section}>
          <View style={styles.persistenceIndicator}>
            <Text style={styles.persistenceText}>
              {isLoading ? '🔄 Chargement...' : '✅ AsyncStorage actif'}
            </Text>
          </View>
        );
      } else if (!hasSearchQuery && contacts.length === 0) {
        return (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateTitle}>{t('noContacts')}</Text>
            <Text style={styles.emptyStateSubtitle}>
              {t('startAddingContacts')}
            <Text style={styles.persistenceSubtext}>
              {contacts.length} contacts sauvegardés localement
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderContactsScreen = () => {
    const stats = getStats();
    
    return (
      <View style={styles.screenContainer}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setCurrentTab('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{t('contacts')}</Text>
          <View style={{width: 60}} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        {/* Header avec bouton d'ajout */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={styles.screenTitle}>Contacts ({stats.totalContacts})</Text>
          <TouchableOpacity 
            style={{
              backgroundColor: '#2196F3',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
            }}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              {showAddForm ? '✕ Annuler' : '+ Nouveau contact'}
            </Text>
          </TouchableOpacity>
        </View>

        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Résumé</Text>
          <Text style={styles.summaryText}>• {stats.totalContacts} contacts au total</Text>
          <Text style={styles.summaryText}>• {stats.blockedContacts} bloqués</Text>
          <Text style={styles.summaryText}>• {stats.totalContacts - stats.blockedContacts} autorisés</Text>
        </View>

        {/* Formulaire d'ajout de contact */}
        {showAddForm && (
          <View style={styles.addFormContainer}>
            <Text style={styles.addFormTitle}>{t('addNewContact')}</Text>
          <View style={{
            backgroundColor: '#f8f9fa',
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#e9ecef',
          }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 15, color: '#333' }}>
              ➕ Ajouter un nouveau contact
            </Text>
            
            <TextInput
              style={styles.formInput}
              placeholder={t('namePlaceholder')}
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
                backgroundColor: 'white',
                fontSize: 16,
              }}
              placeholder="Nom du contact"
              value={newContact.name}
              onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
              autoCapitalize="words"
            />
            
            <TextInput
              style={styles.formInput}
              placeholder={t('phonePlaceholder')}
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                marginBottom: 15,
                backgroundColor: 'white',
                fontSize: 16,
              }}
              placeholder="Numéro de téléphone"
              value={newContact.phone}
              onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />
            
            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddForm(false);
                  setNewContact({ name: '', phone: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddContact}
              >
                <Text style={styles.saveButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#4caf50',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={addManualContact}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                💾 Enregistrer le contact
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={filteredContacts}
          renderItem={ContactItem}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState()}
          ListFooterComponent={
            showAddButton && !showAddForm ? (
              <View style={styles.footerContainer}>
                <TouchableOpacity 
                  style={[
                    styles.addContactButton,
                    hasResults && { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#2196F3' }
                  ]}
                  onPress={() => setShowAddForm(true)}
                >
                  <Text style={[
                    styles.addContactButtonText,
                    hasResults && { color: '#2196F3' }
                  ]}>
                    {t('newContact')}
                  </Text>
                </TouchableOpacity>
        {contacts.length > 0 ? (
          <View style={styles.contactsList}>
            <Text style={styles.listTitle}>📱 Vos contacts :</Text>
            {contacts.map(contact => (
              <View key={contact.id} style={styles.contactPreview}>
                <Text style={styles.contactName}>
                  {contact.isBlocked ? '🚫' : '✅'} {contact.name}
                </Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
                <Text style={styles.contactStats}>
                  📞 {contact.callsBlocked || 0} • 💬 {contact.messagesBlocked || 0}
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    );
  };

  // Écran Liste noire
  const renderBlacklistScreen = () => {
    const BlockedItem = ({ item }: { item: BlockedContact }) => (
      <View style={styles.blockedCard}>
        <View style={styles.blockedHeader}>
          <View style={styles.blockedInfo}>
            <Text style={styles.blockedName}>{item.name}</Text>
            <Text style={styles.blockedPhone}>{item.phone}</Text>
            <Text style={styles.blockedDate}>{t('blockedSince')} {item.blockedDate}</Text>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.unblockButton}
            onPress={() => Alert.alert(t('unblock'), `${t('unblock')} ${item.name} ?`)}
          >
            <Text style={styles.unblockButtonText}>{t('unblock')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.blockedStats}>
          <View style={styles.blockedStat}>
            <Text style={styles.blockedStatValue}>{item.callsBlocked}</Text>
            <Text style={styles.blockedStatLabel}>{t('callsBlocked')}</Text>
          </View>
          <View style={styles.blockedStat}>
            <Text style={styles.blockedStatValue}>{item.messagesBlocked}</Text>
            <Text style={styles.blockedStatLabel}>{t('smsBlocked')}</Text>
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.screenContainer}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setCurrentTab('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{t('blacklist')}</Text>
          <View style={{width: 60}} />
        </View>

        <View style={styles.blacklistHeader}>
          <View style={styles.blacklistStat}>
            <Text style={styles.blacklistStatValue}>{blockedContacts.length}</Text>
            <Text style={styles.blacklistStatLabel}>{t('blockedContacts')}</Text>
          </View>
          <View style={styles.blacklistStat}>
            <Text style={styles.blacklistStatValue}>
              {blockedContacts.reduce((sum, c) => sum + c.callsBlocked, 0)}
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Aucun contact</Text>
            <Text style={styles.emptySubtitle}>
              Utilisez le bouton "+ Nouveau contact" pour ajouter votre premier contact
            </Text>
            <Text style={styles.blacklistStatLabel}>{t('callsBlocked')}</Text>
          </View>
          <View style={styles.blacklistStat}>
            <Text style={styles.blacklistStatValue}>
              {blockedContacts.reduce((sum, c) => sum + c.messagesBlocked, 0)}
            </Text>
            <Text style={styles.blacklistStatLabel}>{t('smsBlocked')}</Text>
          </View>
        </View>
        <FlatList
          data={blockedContacts}
          renderItem={BlockedItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
        )}

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentTab('home')}
        >
          <Text style={styles.backButtonText}>← Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Écran Planning
  const renderScheduleScreen = () => {
    const RuleItem = ({ item }: { item: ScheduleRule }) => (
      <View style={styles.ruleCard}>
        <View style={styles.ruleHeader}>
          <View style={styles.ruleInfo}>
            <Text style={styles.ruleName}>{item.name}</Text>
            <Text style={styles.ruleTime}>{item.startTime} - {item.endTime}</Text>
            <View style={styles.ruleDays}>
              {item.days.map((day, index) => (
                <View key={index} style={styles.dayChip}>
                  <Text style={styles.dayText}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.ruleControls}>
            <View style={[
              styles.typeChip, 
              { 
                backgroundColor: item.isActive 
                  ? (item.type === 'block' ? '#f44336' : '#4caf50')
                  : '#9e9e9e',
                opacity: item.isActive ? 1 : 0.7
              }
            ]}>
              <Text style={styles.typeText}>
                {item.type === 'block' ? t('blockAction') : t('allow')}
                {!item.isActive && t('inactive')}
              </Text>
            </View>
            <Switch
              value={item.isActive}
              onValueChange={(value) => {
                setScheduleRules(prev => 
                  prev.map(rule => 
                    rule.id === item.id ? { ...rule, isActive: value } : rule
                  )
                );
                Alert.alert('Info', `${t('rule')} "${item.name}" ${value ? t('ruleActivated') : t('ruleDeactivated')}`);
              }}
              trackColor={{ false: '#ccc', true: '#2196F3' }}
              thumbColor={item.isActive ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>
    );

  const renderBlacklistScreen = () => {
    const blockedContacts = contacts.filter(c => c.isBlocked);
    
    return (
      <View style={styles.screenContainer}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setCurrentTab('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{t('schedule')}</Text>
          <View style={{width: 60}} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            {t('scheduleInfo')}
        <Text style={styles.screenTitle}>Liste Noire ({blockedContacts.length})</Text>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>🚫 Contacts bloqués</Text>
          <Text style={styles.summaryText}>
            {blockedContacts.length === 0 
              ? 'Aucun contact bloqué pour le moment'
              : `${blockedContacts.length} contact(s) en liste noire`
            }
          </Text>
        </View>

        {blockedContacts.length > 0 && (
          <View style={styles.contactsList}>
            <Text style={styles.listTitle}>🚫 Contacts bloqués :</Text>
            {blockedContacts.map(contact => (
              <View key={contact.id} style={styles.blockedContactPreview}>
                <Text style={styles.contactName}>🚫 {contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
                <Text style={styles.contactStats}>
                  📞 {contact.callsBlocked || 0} appels • 💬 {contact.messagesBlocked || 0} SMS
                </Text>
                {contact.dateBlocked && (
                  <Text style={styles.blockDate}>
                    Bloqué le {new Date(contact.dateBlocked).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentTab('home')}
        >
          <Text style={styles.backButtonText}>← Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Écran Paramètres
  const renderSettingsScreen = () => {
    const SettingItem = ({ title, subtitle, value, onToggle }: { 
      title: string; 
      subtitle: string; 
      value: boolean; 
      onToggle: () => void; 
    }) => (
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#ccc', true: '#2196F3' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      </View>
    );

    const LanguageSelector = () => (
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{t('language')}</Text>
          <Text style={styles.settingSubtitle}>{t('languageDesc')}</Text>
        </View>
        <View style={styles.languageButtons}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === 'fr' && styles.languageButtonActive
            ]}
            onPress={() => setLanguage('fr')}
          >
            <Text style={[
              styles.languageButtonText,
              language === 'fr' && styles.languageButtonTextActive
            ]}>🇫🇷 FR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === 'en' && styles.languageButtonActive
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[
              styles.languageButtonText,
              language === 'en' && styles.languageButtonTextActive
            ]}>🇬🇧 EN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

  const renderOtherScreen = (screenName: string) => {
    return (
      <ScrollView style={styles.screenContainer}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setCurrentTab('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{t('settings')}</Text>
          <View style={{width: 60}} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>U</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{t('userProfile')}</Text>
            <Text style={styles.profileStatus}>{t('protectionActive')}</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>{t('blocking')}</Text>
          <SettingItem
            title={t('blockUnknown')}
            subtitle={t('blockUnknownDesc')}
            value={settings.blockUnknown}
            onToggle={() => setSettings(prev => ({ ...prev, blockUnknown: !prev.blockUnknown }))}
          />
          <SettingItem
            title={t('blockInternational')}
            subtitle={t('blockInternationalDesc')}
            value={settings.blockInternational}
            onToggle={() => setSettings(prev => ({ ...prev, blockInternational: !prev.blockInternational }))}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>{t('notifications')}</Text>
          <SettingItem
            title={t('notifications')}
            subtitle={t('notificationsDesc')}
            value={settings.notifications}
            onToggle={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>{t('appearance')}</Text>
          <LanguageSelector />
          <SettingItem
            title={t('darkMode')}
            subtitle={t('darkModeDesc')}
            value={settings.darkMode}
            onToggle={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>{t('about')}</Text>
          <TouchableOpacity 
            style={styles.aboutButton}
            onPress={() => Alert.alert('BlockR', t('version'))}
          >
            <Text style={styles.aboutButtonText}>{t('aboutBlockR')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.screenContainer}>
        <Text style={styles.screenTitle}>{screenName}</Text>
        <Text style={styles.placeholder}>Écran en cours de développement</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentTab('home')}
        >
          <Text style={styles.backButtonText}>← Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🔄 Chargement des données...</Text>
          <Text style={styles.loadingSubtext}>Restauration depuis AsyncStorage</Text>
        </View>
      );
    }

    switch (currentTab) {
      case 'home':
        return renderHomeScreen();
      case 'contacts':
        return renderContactsScreen();
      case 'blacklist':
        return renderBlacklistScreen();
      case 'appblocker':
        return <AppBlockerScreen onBack={() => setCurrentTab('home')} />;
      case 'schedule':
        return renderOtherScreen('Planning');
      case 'settings':
        return renderOtherScreen('Paramètres');
      default:
        return renderHomeScreen();
    }
  };

  return (
    <View style={styles.appContainer}>
      {renderContent()}
      
      {/* Bottom Navigation MODERNISÉE */}
      <View style={styles.bottomNav}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, currentTab === tab.id && styles.activeTab]}
            onPress={() => setCurrentTab(tab.id)}
          >
            <Text style={[
              styles.tabIcon,
              currentTab === tab.id && styles.activeTabIcon
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.tabIcon,
              currentTab === tab.id && styles.activeTabIcon
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.tabText,
              currentTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  screenContainer: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  
  // Header styles
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  
  header: { backgroundColor: '#2196F3', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  // Loading
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  loadingText: { fontSize: 20, fontWeight: 'bold', color: '#2196F3', marginBottom: 10 },
  loadingSubtext: { fontSize: 14, color: '#666' },

  // Header
  header: { 
    backgroundColor: '#2196F3', 
    padding: 20, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20 
  },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)' },

  // Stats
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingHorizontal: 20, 
    marginTop: -30, 
    marginBottom: 20 
  },
  statCard: { 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 15, 
    backgroundColor: 'white', 
    width: '30%', 
    elevation: 3 
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#2196F3' },
  statLabel: { fontSize: 12, marginTop: 5, textAlign: 'center', color: '#666' },

  // Sections
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  actionButton: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 2 },
  actionText: { fontSize: 16, color: '#2196F3', fontWeight: '500' },
  
  // Search styles
  searchContainer: { 
    padding: 16, 
  screenTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },

  // Buttons
  actionButton: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 10, 
    elevation: 2 
  },
  actionText: { fontSize: 16, color: '#2196F3', fontWeight: '500' },

  testButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  testButtonText: { fontSize: 16, color: 'white', fontWeight: 'bold', textAlign: 'center' },
  testInfo: { fontSize: 14, color: '#666', textAlign: 'center', fontStyle: 'italic' },

  backButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Contact styles
  list: { flex: 1 },
  listContent: {
    paddingBottom: 20,
  },
  contactCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: 'white', 
    margin: 8, 
    padding: 16, 
    borderRadius: 12, 
    elevation: 2 
  },
  contactCardBlocked: {
    backgroundColor: '#ffebee',
  },
  contactInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  contactDetails: { marginLeft: 12, flex: 1 },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactName: { fontSize: 16, fontWeight: '600', color: '#333' },
  lockIcon: {
    fontSize: 16,
  },
    marginTop: 20,
  },
  backButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  // Cards
  summaryCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  summaryText: { fontSize: 14, color: '#666', marginBottom: 4 },

  // Contacts list
  contactsList: { 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    elevation: 2 
  },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  contactPreview: { 
    paddingVertical: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  blockedContactPreview: { 
    paddingVertical: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff5f5',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  contactPhone: { fontSize: 14, color: '#666', marginTop: 2 },
  contactStatus: { fontSize: 12, color: '#4caf50', marginTop: 2, fontStyle: 'italic' },
  blockButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  blockButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  contactStats: { fontSize: 12, color: '#999', marginTop: 4 },
  blockDate: { fontSize: 12, color: '#f44336', marginTop: 2, fontStyle: 'italic' },

  // Form styles
  addFormContainer: { 
    backgroundColor: 'white', 
    margin: 16, 
    padding: 20, 
    borderRadius: 16, 
    elevation: 4,
  // Persistence indicator
  persistenceIndicator: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  persistenceText: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32', marginBottom: 4 },
  persistenceSubtext: { fontSize: 14, color: '#388e3c' },

  // Empty states
  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 40 
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },

  // Placeholder
  placeholder: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 40 },

  // Navigation MODERNISÉE
  bottomNav: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    elevation: 8, 
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tab: { 
    flex: 1, 
    padding: 12, 
    borderRadius: 8, 
    marginHorizontal: 4 
  },
  cancelButton: { 
    backgroundColor: '#f44336' 
  },
  saveButton: { 
    backgroundColor: '#4caf50' 
  },
  cancelButtonText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  saveButtonText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  
  // Footer styles
  footerContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  addContactButton: { 
    backgroundColor: '#2196F3', 
    marginHorizontal: 0,
    padding: 14, 
    borderRadius: 12, 
    elevation: 2 
  },
  addContactButtonText: { 
    color: 'white', 
    textAlign: 'center', 
    fontSize: 15,
    fontWeight: '600'
  },
  
  // Empty state styles
  emptyStateContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: '#e3f2fd',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  activeTabIcon: {
    fontSize: 20,
  },
  tabText: { 
    fontSize: 10, 
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Blacklist styles
  blacklistHeader: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#2196F3', paddingVertical: 20 },
  blacklistStat: { alignItems: 'center' },
  blacklistStatValue: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  blacklistStatLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  blockedCard: { backgroundColor: 'white', margin: 8, padding: 16, borderRadius: 12, elevation: 2 },
  blockedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  blockedInfo: { flex: 1 },
  blockedName: { fontSize: 16, fontWeight: '600', color: '#333' },
  blockedPhone: { fontSize: 14, color: '#666', marginTop: 2 },
  blockedDate: { fontSize: 12, color: '#999', marginTop: 4 },
  unblockButton: { backgroundColor: '#4caf50', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  unblockButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  blockedStats: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  blockedStat: { alignItems: 'center' },
  blockedStatValue: { fontSize: 18, fontWeight: 'bold', color: '#2196F3' },
  blockedStatLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  
  // Schedule styles
  infoCard: { backgroundColor: '#e3f2fd', margin: 16, padding: 16, borderRadius: 12 },
  infoText: { fontSize: 14, color: '#1976d2', textAlign: 'center' },
  ruleCard: { backgroundColor: 'white', margin: 8, padding: 16, borderRadius: 12, elevation: 2 },
  ruleHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  ruleInfo: { flex: 1 },
  ruleName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  ruleTime: { fontSize: 14, color: '#666', marginBottom: 8 },
  ruleDays: { flexDirection: 'row', flexWrap: 'wrap' },
  dayChip: { backgroundColor: '#2196F3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 4 },
  dayText: { color: 'white', fontSize: 11, fontWeight: '500' },
  ruleControls: { alignItems: 'flex-end' },
  typeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 8 },
  typeText: { color: 'white', fontSize: 12, fontWeight: '600' },
  
  // Settings styles
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', margin: 16, padding: 20, borderRadius: 16, elevation: 2 },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center' },
  profileAvatarText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  profileInfo: { marginLeft: 16, flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  profileStatus: { fontSize: 14, color: '#666', marginTop: 2 },
  settingsSection: { marginBottom: 20 },
  settingsSectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginHorizontal: 16, marginBottom: 8, textTransform: 'uppercase' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginHorizontal: 16, padding: 16, borderRadius: 12, marginBottom: 8, elevation: 1 },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '500', color: '#333' },
  settingSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  aboutButton: { backgroundColor: 'white', marginHorizontal: 16, padding: 16, borderRadius: 12, elevation: 1 },
  aboutButtonText: { fontSize: 16, color: '#2196F3', fontWeight: '500', textAlign: 'center' },
  
  // Language selector styles
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: 'white',
  },
  languageButtonActive: {
    backgroundColor: '#2196F3',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: 'white',
  },
  
  // Bottom navigation
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', elevation: 8, height: 60 },
  tab: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabIcon: { fontSize: 24, marginBottom: 2, opacity: 0.8 },
  activeTabIcon: { opacity: 1 },
  tabText: { fontSize: 11, color: '#666' },
  activeTabText: { color: '#2196F3', fontWeight: 'bold' },
  },
  activeTabText: { 
    color: '#2196F3', 
    fontWeight: '700',
    fontSize: 11,
  },
});

export default App;