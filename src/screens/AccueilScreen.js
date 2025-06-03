// Chemin: /src/screens/AccueilScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const AccueilScreen = () => {
  const stats = {
    appelsBloques: 247,
    contactsGeres: 89,
    reglesActives: 12,
  };

  const recentActivity = [
    { id: 1, type: 'block', number: '+33 6 12 34 56 78', time: '14:32', reason: 'Liste noire' },
    { id: 2, type: 'allowed', number: 'Marie Dupont', time: '13:45', reason: 'Contact autorisé' },
    { id: 3, type: 'block', number: '+33 1 23 45 67 89', time: '12:15', reason: 'Hors créneaux' },
  ];

  const StatCard = ({ title, value, emoji, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View style={styles.statHeader}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Section Bienvenue */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Bienvenue sur BlockR</Text>
        <Text style={styles.welcomeSubtitle}>
          Gérez vos appels et contacts en toute sérénité
        </Text>
      </View>

      {/* Statistiques */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aperçu</Text>
        <View style={styles.statsContainer}>
          <StatCard
            title="Appels bloqués"
            value={stats.appelsBloques}
            emoji="🚫"
            color="#f44336"
          />
          <StatCard
            title="Contacts gérés"
            value={stats.contactsGeres}
            emoji="👥"
            color="#4CAF50"
          />
          <StatCard
            title="Règles actives"
            value={stats.reglesActives}
            emoji="⚙️"
            color="#2196F3"
          />
        </View>
      </View>

      {/* Actions rapides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF5015' }]}>
              <Text style={styles.actionEmoji}>👤</Text>
            </View>
            <Text style={styles.quickActionText}>Ajouter contact</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#f4433615' }]}>
              <Text style={styles.actionEmoji}>🚫</Text>
            </View>
            <Text style={styles.quickActionText}>Bloquer numéro</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FF980015' }]}>
              <Text style={styles.actionEmoji}>📅</Text>
            </View>
            <Text style={styles.quickActionText}>Gérer planning</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#607D8B15' }]}>
              <Text style={styles.actionEmoji}>⚙️</Text>
            </View>
            <Text style={styles.quickActionText}>Paramètres</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Activité récente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activité récente</Text>
        <View style={styles.activityContainer}>
          {recentActivity.map((item) => (
            <View key={item.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: item.type === 'block' ? '#ffebee' : '#e8f5e8' }]}>
                <Text style={styles.activityEmoji}>
                  {item.type === 'block' ? '🚫' : '✅'}
                </Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityNumber}>{item.number}</Text>
                <Text style={styles.activityReason}>{item.reason}</Text>
              </View>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Voir toute l'activité →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  welcomeSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  statsContainer: {
    gap: 12,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statContent: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
  },
  statTitle: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: (width - 64) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionEmoji: {
    fontSize: 20,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    textAlign: 'center',
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 14,
  },
  activityContent: {
    flex: 1,
  },
  activityNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  activityReason: {
    fontSize: 12,
    color: '#6c757d',
  },
  activityTime: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default AccueilScreen;