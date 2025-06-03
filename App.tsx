import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  TextInput,
  Switch,
  Alert,
} from 'react-native';

// Types pour les données
interface Contact {
  id: string;
  name: string;
  phone: string;
  isBlocked: boolean;
}

interface BlockedContact {
  id: string;
  name: string;
  phone: string;
  blockedDate: string;
  callsBlocked: number;
  messagesBlocked: number;
}

interface ScheduleRule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  isActive: boolean;
  type: 'block' | 'allow';
}

const App = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour le formulaire d'ajout de contact
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  // Données de test
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Alice Martin', phone: '+33 6 12 34 56 78', isBlocked: false },
    { id: '2', name: 'Bob Dupont', phone: '+33 6 98 76 54 32', isBlocked: true },
    { id: '3', name: 'Claire Durand', phone: '+33 7 11 22 33 44', isBlocked: false },
    { id: '4', name: 'David Moreau', phone: '+33 6 55 66 77 88', isBlocked: false },
  ]);

  const [blockedContacts] = useState<BlockedContact[]>([
    { id: '1', name: 'Spam Télécom', phone: '+33 8 99 99 99 99', blockedDate: '15 Jan 2024', callsBlocked: 23, messagesBlocked: 5 },
    { id: '2', name: 'Bob Dupont', phone: '+33 6 98 76 54 32', blockedDate: '20 Fév 2024', callsBlocked: 7, messagesBlocked: 12 },
    { id: '3', name: 'Marketing Pro', phone: '+33 1 23 45 67 89', blockedDate: '10 Mar 2024', callsBlocked: 45, messagesBlocked: 0 },
  ]);

  const [scheduleRules] = useState<ScheduleRule[]>([
    { id: '1', name: 'Heures de travail', startTime: '09:00', endTime: '18:00', days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'], isActive: true, type: 'allow' },
    { id: '2', name: 'Nuit tranquille', startTime: '22:00', endTime: '07:00', days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], isActive: true, type: 'block' },
    { id: '3', name: 'Weekend relax', startTime: '10:00', endTime: '20:00', days: ['Sam', 'Dim'], isActive: false, type: 'allow' },
  ]);

  const [settings, setSettings] = useState({
    blockUnknown: true,
    blockInternational: false,
    notifications: true,
    darkMode: false,
  });

  const tabs = [
    { id: 'home', label: 'Accueil' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'blacklist', label: 'Liste noire' },
    { id: 'schedule', label: 'Planning' },
    { id: 'settings', label: 'Paramètres' },
  ];

  // Écran d'accueil
  const renderHomeScreen = () => (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BlockR</Text>
        <Text style={styles.headerSubtitle}>Votre protection contre les appels indésirables</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Contacts bloqués</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Bloqués aujourd'hui</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Règles actives</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentTab('contacts')}
        >
          <Text style={styles.actionText}>📱 Ajouter un numéro</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentTab('schedule')}
        >
          <Text style={styles.actionText}>📅 Nouvelle règle</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Activité récente', 
            '🚫 Appel bloqué: +33 6 12 34 56 78 (il y a 2h)\n🚫 SMS bloqué: +33 8 99 99 99 99 (il y a 5h)\n🚫 Appel bloqué: Marketing Pro (hier)\n🚫 Appel bloqué: Spam Télécom (hier)\n\n✅ Total aujourd\'hui: 3 appels bloqués'
          )}
        >
          <Text style={styles.actionText}>📊 Voir l'activité récente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Écran Contacts - VERSION AMÉLIORÉE avec logique conditionnelle
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
          name: newContact.name.trim(),
          phone: newContact.phone.trim(),
          isBlocked: false
        };
        
        setContacts(prev => [...prev, contactToAdd]);
        
        Alert.alert(
          'Contact ajouté ✅',
          `${newContact.name} a été ajouté avec succès !`,
          [
            {
              text: 'OK',
              onPress: () => {
                setNewContact({ name: '', phone: '' });
                setShowAddForm(false);
                setSearchQuery(''); // Efface la recherche pour voir le nouveau contact
              }
            }
          ]
        );
      } else {
        Alert.alert('Erreur ❌', 'Veuillez remplir tous les champs');
      }
    };

    const handleToggleBlock = (contact: Contact) => {
      const action = contact.isBlocked ? 'débloquer' : 'bloquer';
      Alert.alert(
        `🔒 ${action.charAt(0).toUpperCase() + action.slice(1)} contact`,
        `Êtes-vous sûr de vouloir ${action} ${contact.name} ?\n\n${
          contact.isBlocked 
            ? '✅ Ce contact pourra à nouveau vous appeler' 
            : '🚫 Ce contact ne pourra plus vous appeler'
        }`,
        [
          { 
            text: '❌ Annuler', 
            style: 'cancel' 
          },
          {
            text: `✅ ${action.charAt(0).toUpperCase() + action.slice(1)}`,
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
      <View style={styles.contactCard}>
        <View style={styles.contactInfo}>
          <View style={[styles.avatar, { backgroundColor: item.isBlocked ? '#f44336' : '#2196F3' }]}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.blockButton, { backgroundColor: item.isBlocked ? '#4caf50' : '#f44336' }]}
          onPress={() => handleToggleBlock(item)}
        >
          <Text style={styles.blockButtonText}>{item.isBlocked ? 'Débloquer' : 'Bloquer'}</Text>
        </TouchableOpacity>
      </View>
    );

    const renderEmptyState = () => {
      if (hasSearchQuery && !hasResults) {
        return (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>Aucun contact trouvé</Text>
            <Text style={styles.emptyStateSubtitle}>
              Aucun contact ne correspond à "{searchQuery}"
            </Text>
          </View>
        );
      } else if (!hasSearchQuery && contacts.length === 0) {
        return (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateTitle}>Aucun contact</Text>
            <Text style={styles.emptyStateSubtitle}>
              Commencez par ajouter votre premier contact
            </Text>
          </View>
        );
      }
      return null;
    };

    return (
      <View style={styles.screenContainer}>
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Rechercher un contact..."
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
        </View>

        {/* Formulaire d'ajout (si visible) */}
        {showAddForm && (
          <View style={styles.addFormContainer}>
            <Text style={styles.addFormTitle}>📱 Ajouter un nouveau contact</Text>
            
            <TextInput
              style={styles.formInput}
              placeholder="👤 Nom complet (ex: Jean Dupont)"
              value={newContact.name}
              onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
              style={styles.formInput}
              placeholder="📞 Numéro de téléphone (ex: +33 6 12 34 56 78)"
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
                <Text style={styles.cancelButtonText}>❌ Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddContact}
              >
                <Text style={styles.saveButtonText}>✅ Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Liste des contacts */}
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
                    + Nouveau contact
                  </Text>
                </TouchableOpacity>
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
            <Text style={styles.blockedDate}>Bloqué depuis: {item.blockedDate}</Text>
          </View>
          <TouchableOpacity 
            style={styles.unblockButton}
            onPress={() => Alert.alert('Débloquer', `Débloquer ${item.name} ?`)}
          >
            <Text style={styles.unblockButtonText}>Débloquer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.blockedStats}>
          <View style={styles.blockedStat}>
            <Text style={styles.blockedStatValue}>{item.callsBlocked}</Text>
            <Text style={styles.blockedStatLabel}>Appels bloqués</Text>
          </View>
          <View style={styles.blockedStat}>
            <Text style={styles.blockedStatValue}>{item.messagesBlocked}</Text>
            <Text style={styles.blockedStatLabel}>SMS bloqués</Text>
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.screenContainer}>
        <View style={styles.blacklistHeader}>
          <View style={styles.blacklistStat}>
            <Text style={styles.blacklistStatValue}>{blockedContacts.length}</Text>
            <Text style={styles.blacklistStatLabel}>Contacts bloqués</Text>
          </View>
          <View style={styles.blacklistStat}>
            <Text style={styles.blacklistStatValue}>
              {blockedContacts.reduce((sum, c) => sum + c.callsBlocked, 0)}
            </Text>
            <Text style={styles.blacklistStatLabel}>Appels bloqués</Text>
          </View>
          <View style={styles.blacklistStat}>
            <Text style={styles.blacklistStatValue}>
              {blockedContacts.reduce((sum, c) => sum + c.messagesBlocked, 0)}
            </Text>
            <Text style={styles.blacklistStatLabel}>SMS bloqués</Text>
          </View>
        </View>
        <FlatList
          data={blockedContacts}
          renderItem={BlockedItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
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
            <View style={[styles.typeChip, { backgroundColor: item.type === 'block' ? '#f44336' : '#4caf50' }]}>
              <Text style={styles.typeText}>{item.type === 'block' ? 'Bloquer' : 'Autoriser'}</Text>
            </View>
            <Switch
              value={item.isActive}
              onValueChange={() => {}}
              trackColor={{ false: '#ccc', true: '#2196F3' }}
              thumbColor={item.isActive ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.screenContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Programmez des règles de blocage automatiques selon vos horaires
          </Text>
        </View>
        <FlatList
          data={scheduleRules}
          renderItem={RuleItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
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

    return (
      <ScrollView style={styles.screenContainer}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>U</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Utilisateur BlockR</Text>
            <Text style={styles.profileStatus}>Protection active</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Blocage</Text>
          <SettingItem
            title="Bloquer numéros inconnus"
            subtitle="Bloquer automatiquement les appels de numéros non enregistrés"
            value={settings.blockUnknown}
            onToggle={() => setSettings(prev => ({ ...prev, blockUnknown: !prev.blockUnknown }))}
          />
          <SettingItem
            title="Bloquer appels internationaux"
            subtitle="Bloquer les appels provenant de l'étranger"
            value={settings.blockInternational}
            onToggle={() => setSettings(prev => ({ ...prev, blockInternational: !prev.blockInternational }))}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Notifications</Text>
          <SettingItem
            title="Notifications"
            subtitle="Recevoir des notifications d'appels bloqués"
            value={settings.notifications}
            onToggle={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Apparence</Text>
          <SettingItem
            title="Mode sombre"
            subtitle="Utiliser le thème sombre"
            value={settings.darkMode}
            onToggle={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>À propos</Text>
          <TouchableOpacity 
            style={styles.aboutButton}
            onPress={() => Alert.alert('BlockR', 'Version 1.0.0\nDéveloppé avec React Native')}
          >
            <Text style={styles.aboutButtonText}>À propos de BlockR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home': return renderHomeScreen();
      case 'contacts': return renderContactsScreen();
      case 'blacklist': return renderBlacklistScreen();
      case 'schedule': return renderScheduleScreen();
      case 'settings': return renderSettingsScreen();
      default: return renderHomeScreen();
    }
  };

  return (
    <View style={styles.appContainer}>
      {renderContent()}
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => setCurrentTab(tab.id)}
          >
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
  screenContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  
  // Header styles
  header: { backgroundColor: '#2196F3', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)' },
  
  // Stats styles
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginTop: -30, marginBottom: 20 },
  statCard: { alignItems: 'center', padding: 15, borderRadius: 15, backgroundColor: 'white', width: '30%', elevation: 3 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#2196F3' },
  statLabel: { fontSize: 12, marginTop: 5, textAlign: 'center', color: '#666' },
  
  // Section styles
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  actionButton: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 2 },
  actionText: { fontSize: 16, color: '#2196F3', fontWeight: '500' },
  
  // Search styles améliorés
  searchContainer: { 
    padding: 16, 
    backgroundColor: 'white', 
    margin: 16, 
    borderRadius: 12, 
    elevation: 2,
    position: 'relative'
  },
  searchInput: { fontSize: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, paddingRight: 40 },
  clearButton: {
    position: 'absolute',
    right: 24,
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
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
  contactCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', margin: 8, padding: 16, borderRadius: 12, elevation: 2 },
  contactInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  contactDetails: { marginLeft: 12, flex: 1 },
  contactName: { fontSize: 16, fontWeight: '600', color: '#333' },
  contactPhone: { fontSize: 14, color: '#666', marginTop: 2 },
  blockButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  blockButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  // Styles pour le formulaire d'ajout de contact
  addFormContainer: { 
    backgroundColor: 'white', 
    margin: 16, 
    padding: 20, 
    borderRadius: 16, 
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3'
  },
  addFormTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2196F3', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  formInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12, 
    fontSize: 16, 
    backgroundColor: '#f9f9f9' 
  },
  formButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 8 
  },
  formButton: { 
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
  
  // Bouton d'ajout amélioré
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
  
  // États vides améliorés
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Styles obsolètes (gardés pour compatibilité)
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: 50 
  },
  emptyText: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center' 
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
  typeChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  typeText: { color: 'white', fontSize: 10, fontWeight: '600' },
  
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
  
  // Bottom navigation
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', elevation: 8, height: 60 },
  tab: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabText: { fontSize: 12, color: '#666' },
  activeTabText: { color: '#2196F3', fontWeight: 'bold' },
});

export default App;