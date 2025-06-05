import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Modal,
} from 'react-native';

// Types pour les applications
interface App {
  id: string;
  name: string;
  packageName: string;
  isBlocked: boolean;
  icon?: string;
  category: 'social' | 'games' | 'entertainment' | 'productivity' | 'other';
}

// Types pour les sessions de blocage
interface BlockingSession {
  id: string;
  name: string;
  blockedApps: string[]; // IDs des apps bloquées
  duration: number; // en minutes
  isActive: boolean;
  startTime?: string;
  endTime?: string;
}

interface AppBlockerScreenProps {
  onBack: () => void;
}

const AppBlockerScreen: React.FC<AppBlockerScreenProps> = ({ onBack }) => {
  const [apps, setApps] = useState<App[]>([]);
  const [blockingSessions, setBlockingSessions] = useState<BlockingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<BlockingSession | null>(null);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionDuration, setNewSessionDuration] = useState('30');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSession, setExpandedSession] = useState<boolean>(true);

  // ================================
  // CHARGEMENT INITIAL DES APPLICATIONS
  // ================================
  
  useEffect(() => {
    loadInstalledApps();
    loadBlockingSessions();
  }, []);

  const loadInstalledApps = () => {
    const mockApps: App[] = [
      { id: '1', name: 'Instagram', packageName: 'com.instagram.android', isBlocked: false, category: 'social' },
      { id: '2', name: 'Facebook', packageName: 'com.facebook.katana', isBlocked: false, category: 'social' },
      { id: '3', name: 'TikTok', packageName: 'com.zhiliaoapp.musically', isBlocked: false, category: 'entertainment' },
      { id: '4', name: 'YouTube', packageName: 'com.google.android.youtube', isBlocked: false, category: 'entertainment' },
      { id: '5', name: 'Twitter/X', packageName: 'com.twitter.android', isBlocked: false, category: 'social' },
      { id: '6', name: 'Snapchat', packageName: 'com.snapchat.android', isBlocked: false, category: 'social' },
      { id: '7', name: 'WhatsApp', packageName: 'com.whatsapp', isBlocked: false, category: 'social' },
      { id: '8', name: 'Netflix', packageName: 'com.netflix.mediaclient', isBlocked: false, category: 'entertainment' },
      { id: '9', name: 'Candy Crush', packageName: 'com.king.candycrushsaga', isBlocked: false, category: 'games' },
      { id: '10', name: 'Reddit', packageName: 'com.reddit.frontpage', isBlocked: false, category: 'social' },
    ];

    setApps(mockApps);
  };

  const loadBlockingSessions = () => {
    const mockSessions: BlockingSession[] = [
      {
        id: '1',
        name: 'Mode Travail',
        blockedApps: ['1', '2', '3'],
        duration: 120,
        isActive: false,
      },
      {
        id: '2',
        name: 'Mode Étude',
        blockedApps: ['1', '2', '3', '4', '5'],
        duration: 90,
        isActive: false,
      },
    ];

    setBlockingSessions(mockSessions);
  };

  // ================================
  // GESTION DES SESSIONS DE BLOCAGE
  // ================================

  const createBlockingSession = () => {
    if (!newSessionName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour la session');
      return;
    }

    if (selectedApps.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins une application à bloquer');
      return;
    }

    const newSession: BlockingSession = {
      id: Date.now().toString(),
      name: newSessionName.trim(),
      blockedApps: [...selectedApps],
      duration: parseInt(newSessionDuration) || 30,
      isActive: false,
    };

    setBlockingSessions(prev => [...prev, newSession]);
    
    // Reset du formulaire
    setNewSessionName('');
    setNewSessionDuration('30');
    setSelectedApps([]);
    setShowCreateSession(false);

    // Feedback visuel amélioré avec options
    Alert.alert(
      '✅ Session créée avec succès !',
      `"${newSession.name}" est prête à utiliser.\n\n` +
      `📱 ${newSession.blockedApps.length} application(s) sélectionnée(s)\n` +
      `⏱️ Durée : ${newSession.duration} minutes`,
      [
        { 
          text: 'OK', 
          style: 'default'
        },
        { 
          text: 'Démarrer maintenant', 
          style: 'default',
          onPress: () => startBlockingSession(newSession)
        }
      ]
    );
  };

  const startBlockingSession = (session: BlockingSession) => {
    if (currentSession) {
      stopBlockingSession();
    }

    const updatedSession = {
      ...session,
      isActive: true,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + session.duration * 60000).toISOString(),
    };

    setBlockingSessions(prev => 
      prev.map(s => s.id === session.id ? updatedSession : { ...s, isActive: false })
    );
    setCurrentSession(updatedSession);

    setApps(prev => 
      prev.map(app => ({
        ...app,
        isBlocked: session.blockedApps.includes(app.id)
      }))
    );

    Alert.alert(
      'Session démarrée',
      `"${session.name}" est active.\n${session.blockedApps.length} apps bloquées.`
    );
  };

  const stopBlockingSession = () => {
    if (!currentSession) return;

    setBlockingSessions(prev => 
      prev.map(s => s.id === currentSession.id ? { ...s, isActive: false } : s)
    );
    setCurrentSession(null);

    setApps(prev => prev.map(app => ({ ...app, isBlocked: false })));

    Alert.alert('Session terminée', 'Toutes les applications sont débloquées.');
  };

  // ================================
  // GESTION DES APPLICATIONS
  // ================================

  const toggleAppInSelection = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const closeModal = () => {
    setShowCreateSession(false);
    setSelectedApps([]);
    setNewSessionName('');
    setNewSessionDuration('30');
  };

  // ================================
  // FILTRAGE ET RECHERCHE
  // ================================

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social': return '👥';
      case 'games': return '🎮';
      case 'entertainment': return '🎬';
      case 'productivity': return '💼';
      default: return '📱';
    }
  };

  // ================================
  // COMPOSANTS DE RENDU MODERNISÉS
  // ================================

  const renderActiveSession = () => {
    if (!currentSession) return null;

    const timeRemaining = currentSession.endTime 
      ? Math.max(0, Math.floor((new Date(currentSession.endTime).getTime() - Date.now()) / 60000))
      : 0;

    const blockedAppNames = apps
      .filter(app => currentSession.blockedApps.includes(app.id))
      .map(app => app.name);

    return (
      <View style={styles.activeSessionCard}>
        <TouchableOpacity 
          style={styles.sessionHeader}
          onPress={() => setExpandedSession(!expandedSession)}
        >
          <View style={styles.sessionHeaderLeft}>
            <View style={styles.statusIndicator} />
            <Text style={styles.sessionTitle}>Session active</Text>
            <Text style={styles.sessionName}>{currentSession.name}</Text>
          </View>
          <View style={styles.sessionHeaderRight}>
            <Text style={styles.timeRemaining}>{timeRemaining}min</Text>
            <Text style={styles.expandIcon}>{expandedSession ? '−' : '+'}</Text>
          </View>
        </TouchableOpacity>

        {expandedSession && (
          <View style={styles.sessionContent}>
            <View style={styles.blockedAppsGrid}>
              {blockedAppNames.map((appName, index) => (
                <View key={index} style={styles.blockedAppChip}>
                  <Text style={styles.blockedAppText}>{appName}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.stopButton}
              onPress={stopBlockingSession}
            >
              <Text style={styles.stopButtonText}>Arrêter</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderSession = (session: BlockingSession) => {
    if (session.isActive) return null;

    const blockedAppNames = apps
      .filter(app => session.blockedApps.includes(app.id))
      .map(app => app.name)
      .slice(0, 2)
      .join(', ');

    const moreApps = session.blockedApps.length > 2 ? ` +${session.blockedApps.length - 2}` : '';

    return (
      <View key={session.id} style={styles.sessionCard}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionCardName}>{session.name}</Text>
          <Text style={styles.sessionAppsText}>
            {blockedAppNames}{moreApps}
          </Text>
          <Text style={styles.sessionDurationText}>{session.duration}min</Text>
        </View>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => startBlockingSession(session)}
        >
          <Text style={styles.startButtonText}>Démarrer</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderApp = (app: App) => {
    const isSelected = selectedApps.includes(app.id);
    
    return (
      <View key={app.id} style={[styles.appItem, app.isBlocked && styles.appItemBlocked]}>
        <View style={styles.appContent}>
          <View style={styles.appIconContainer}>
            <Text style={styles.appIcon}>{getCategoryIcon(app.category)}</Text>
            {app.isBlocked && (
              <View style={styles.blockedBadge}>
                <Text style={styles.blockedBadgeText}>🔒</Text>
              </View>
            )}
          </View>
          
          <View style={styles.appDetails}>
            <Text style={[styles.appName, app.isBlocked && styles.appNameBlocked]}>
              {app.name}
            </Text>
            {/* PACKAGE NAME EN SOUS-TEXTE DISCRET */}
            <Text style={styles.appPackage}>
              {app.packageName}
            </Text>
            {/* STATUT DE L'APP */}
            {app.isBlocked && (
              <Text style={styles.appStatus}>🔒 Bloquée</Text>
            )}
          </View>
        </View>
        
        {showCreateSession ? (
          <TouchableOpacity
            style={[styles.selectionButton, isSelected && styles.selectedButton]}
            onPress={() => toggleAppInSelection(app.id)}
          >
            <Text style={[styles.selectionText, isSelected && styles.selectedText]}>
              {isSelected ? '✓' : '+'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.switchContainer}>
            {/* INDICATEUR VISUEL CLAIR */}
            <Text style={[styles.switchLabel, app.isBlocked && styles.switchLabelBlocked]}>
              {app.isBlocked ? 'Bloquée' : 'Autorisée'}
            </Text>
            <Switch
              value={app.isBlocked}
              onValueChange={() => toggleAppBlocked(app.id)}
              trackColor={{ false: '#e0e0e0', true: '#ffcdd2' }}
              thumbColor={app.isBlocked ? '#f44336' : '#4caf50'}
              disabled={!!currentSession}
            />
            {!!currentSession && (
              <Text style={styles.disabledHint}>Session active</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderCreateSessionModal = () => (
    <Modal
      visible={showCreateSession}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nouvelle session</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nom (ex: Mode Focus)"
            value={newSessionName}
            onChangeText={setNewSessionName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Durée en minutes"
            value={newSessionDuration}
            onChangeText={setNewSessionDuration}
            keyboardType="numeric"
          />

          <Text style={styles.selectionTitle}>
            Applications à bloquer ({selectedApps.length})
          </Text>

          <ScrollView style={styles.appSelectionScrollView} showsVerticalScrollIndicator={true}>
            {apps.map(app => {
              const isSelected = selectedApps.includes(app.id);
              return (
                <TouchableOpacity
                  key={app.id}
                  style={[styles.modalAppItem, isSelected && styles.modalAppItemSelected]}
                  onPress={() => toggleAppInSelection(app.id)}
                >
                  <View style={styles.modalAppInfo}>
                    <Text style={styles.modalAppIcon}>{getCategoryIcon(app.category)}</Text>
                    <Text style={styles.modalAppName}>{app.name}</Text>
                  </View>
                  <View style={[styles.modalSelectionIndicator, isSelected && styles.modalSelectionIndicatorSelected]}>
                    <Text style={[styles.modalSelectionText, isSelected && styles.modalSelectionTextSelected]}>
                      {isSelected ? '✓' : '+'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedApps.length > 0 && (
            <View style={styles.selectedAppsPreview}>
              <Text style={styles.selectedAppsText}>
                {apps
                  .filter(app => selectedApps.includes(app.id))
                  .map(app => app.name)
                  .join(', ')
                }
              </Text>
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={closeModal}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.createButton, selectedApps.length === 0 && styles.createButtonDisabled]}
              onPress={createBlockingSession}
              disabled={selectedApps.length === 0}
            >
              <Text style={[styles.createButtonText, selectedApps.length === 0 && styles.createButtonTextDisabled]}>
                Créer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocage d'Apps</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={true}
        indicatorStyle="dark"
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {renderActiveSession()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sessions</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowCreateSession(true)}
            >
              <Text style={styles.addButtonText}>+ Nouvelle</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sessionsGrid}>
            {blockingSessions.filter(session => !session.isActive).map(renderSession)}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Applications</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity 
                style={[styles.filterButton, searchQuery === '' && styles.filterButtonActive]}
                onPress={() => setSearchQuery('')}
              >
                <Text style={[styles.filterButtonText, searchQuery === '' && styles.filterButtonTextActive]}>
                  Toutes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, searchQuery === 'blocked' && styles.filterButtonActive]}
                onPress={() => setSearchQuery(apps.some(app => app.isBlocked) ? 'blocked' : '')}
              >
                <Text style={[styles.filterButtonText, searchQuery === 'blocked' && styles.filterButtonTextActive]}>
                  Bloquées
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Rechercher une application..."
            value={searchQuery === 'blocked' ? '' : searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.appsList}>
            {['social', 'entertainment', 'games', 'productivity', 'other'].map(category => {
              let categoryApps = filteredApps.filter(app => app.category === category);
              
              // Filtre spécial pour les apps bloquées
              if (searchQuery === 'blocked') {
                categoryApps = categoryApps.filter(app => app.isBlocked);
              }
              
              if (categoryApps.length === 0) return null;

              const categoryInfo = {
                social: { icon: '👥', name: 'Réseaux sociaux', color: '#3f51b5' },
                entertainment: { icon: '🎬', name: 'Divertissement', color: '#ff9800' },
                games: { icon: '🎮', name: 'Jeux', color: '#4caf50' },
                productivity: { icon: '💼', name: 'Productivité', color: '#607d8b' },
                other: { icon: '📱', name: 'Autres', color: '#9e9e9e' }
              };

              return (
                <View key={category} style={styles.categorySection}>
                  <View style={[styles.categoryHeader, { backgroundColor: categoryInfo[category].color + '15' }]}>
                    <Text style={styles.categoryIcon}>{categoryInfo[category].icon}</Text>
                    <Text style={[styles.categoryTitle, { color: categoryInfo[category].color }]}>
                      {categoryInfo[category].name}
                    </Text>
                    <Text style={styles.categoryCount}>
                      ({categoryApps.length})
                    </Text>
                  </View>
                  <View style={styles.categoryApps}>
                    {categoryApps.map(renderApp)}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {renderCreateSessionModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
    paddingTop: 40,
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Espace pour la navigation
  },
  
  // SESSION ACTIVE MODERNISÉE
  activeSessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#ff5722',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sessionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff5722',
    marginRight: 12,
  },
  sessionTitle: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sessionHeaderRight: {
    alignItems: 'flex-end',
  },
  timeRemaining: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff5722',
  },
  expandIcon: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  sessionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  blockedAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  blockedAppChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  blockedAppText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  stopButton: {
    backgroundColor: '#ff5722',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  stopButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // SECTIONS
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  // NOUVEAUX BOUTONS DE FILTRE
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // SESSIONS GRID
  sessionsGrid: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sessionAppsText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  sessionDurationText: {
    fontSize: 12,
    color: '#999',
  },
  startButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // APPLICATIONS MODERNISÉES
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
  },
  appsList: {
    gap: 24,
  },
  categorySection: {
    marginBottom: 16,
  },
  // NOUVELLE SECTION : En-tête de catégorie amélioré
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'currentColor',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryApps: {
    gap: 8,
  },
  appItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  appItemBlocked: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    backgroundColor: '#fff3f3',
  },
  appContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  appIcon: {
    fontSize: 24,
  },
  blockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f44336',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedBadgeText: {
    fontSize: 8,
    color: 'white',
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  appNameBlocked: {
    color: '#d32f2f',
  },
  appPackage: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  // NOUVEAU : Statut de l'app
  appStatus: {
    fontSize: 12,
    color: '#f44336',
    fontWeight: '600',
  },
  // NOUVEAU : Container pour le switch avec label
  switchContainer: {
    alignItems: 'flex-end',
  },
  switchLabel: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
    marginBottom: 4,
  },
  switchLabelBlocked: {
    color: '#f44336',
  },
  // NOUVEAU : Indication quand désactivé
  disabledHint: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  selectionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  selectionText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  selectedText: {
    color: 'white',
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  appSelectionScrollView: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    marginBottom: 16,
    paddingVertical: 8,
  },
  modalAppItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  modalAppItemSelected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
    borderWidth: 2,
  },
  modalAppInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalAppIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  modalAppName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  modalSelectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalSelectionIndicatorSelected: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  modalSelectionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  modalSelectionTextSelected: {
    color: 'white',
  },
  selectedAppsPreview: {
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectedAppsText: {
    fontSize: 14,
    color: '#2e7d32',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonTextDisabled: {
    color: '#999',
  },
});

export default AppBlockerScreen;