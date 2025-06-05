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

const App = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

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
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'contacts', label: 'Contacts', icon: '📱' },
    { id: 'blacklist', label: 'Liste noire', icon: '🚫' },
    { id: 'appblocker', label: 'Blocage Apps', icon: '🔒' },
    { id: 'schedule', label: 'Planning', icon: '📅' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
  ];

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
            />
            
            <TextInput
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
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Aucun contact</Text>
            <Text style={styles.emptySubtitle}>
              Utilisez le bouton "+ Nouveau contact" pour ajouter votre premier contact
            </Text>
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

  const renderBlacklistScreen = () => {
    const blockedContacts = contacts.filter(c => c.isBlocked);
    
    return (
      <View style={styles.screenContainer}>
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

  const renderOtherScreen = (screenName: string) => {
    return (
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
  contactStats: { fontSize: 12, color: '#999', marginTop: 4 },
  blockDate: { fontSize: 12, color: '#f44336', marginTop: 2, fontStyle: 'italic' },

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
  },
  activeTabText: { 
    color: '#2196F3', 
    fontWeight: '700',
    fontSize: 11,
  },
});

export default App;