import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const stats = [
    {
      icon: 'block-helper',
      label: t('home.activeBlacklist'),
      value: '12',
      color: theme.colors.error,
    },
    {
      icon: 'phone-cancel',
      label: t('home.blockedToday'),
      value: '3',
      color: theme.colors.warning,
    },
    {
      icon: 'calendar-clock',
      label: t('home.scheduledRules'),
      value: '5',
      color: theme.colors.success,
    },
  ];

  const quickActions = [
    {
      icon: 'phone-plus',
      label: 'Ajouter un numéro',
      color: theme.colors.primary,
    },
    {
      icon: 'calendar-plus',
      label: 'Nouvelle règle',
      color: theme.colors.secondary,
    },
    {
      icon: 'gamepad-variant',
      label: 'Jouer',
      color: theme.colors.info,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>{t('home.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('home.subtitle')}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View 
            key={index} 
            style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
          >
            <Icon name={stat.icon} size={32} color={stat.color} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('home.quickActions')}
        </Text>
        <View style={styles.actionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
              activeOpacity={0.7}
            >
              <Icon name={action.icon} size={48} color={action.color} />
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Activité récente
        </Text>
        <View style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
          <Icon name="phone-cancel" size={24} color={theme.colors.error} />
          <View style={styles.activityContent}>
            <Text style={[styles.activityText, { color: theme.colors.text }]}>
              Appel bloqué: +33 6 12 34 56 78
            </Text>
            <Text style={[styles.activityTime, { color: theme.colors.textSecondary }]}>
              Il y a 2 heures
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    width: '30%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    width: '30%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionLabel: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 1,
  },
  activityContent: {
    marginLeft: 15,
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default HomeScreen;