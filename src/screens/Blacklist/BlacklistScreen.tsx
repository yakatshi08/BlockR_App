import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeContext';

interface BlockedContact {
  id: string;
  name: string;
  phone: string;
  blockedDate: Date;
  callsBlocked: number;
  messagesBlocked: number;
}

const BlacklistScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Données de test
  const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>([
    {
      id: '1',
      name: 'Spam Télécom',
      phone: '+33 8 99 99 99 99',
      blockedDate: new Date('2024-01-15'),
      callsBlocked: 23,
      messagesBlocked: 5,
    },
    {
      id: '2',
      name: 'Bob Dupont',
      phone: '+33 6 98 76 54 32',
      blockedDate: new Date('2024-02-20'),
      callsBlocked: 7,
      messagesBlocked: 12,
    },
    {
      id: '3',
      name: 'Marketing Pro',
      phone: '+33 1 23 45 67 89',
      blockedDate: new Date('2024-03-10'),
      callsBlocked: 45,
      messagesBlocked: 0,
    },
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleUnblock = (contact: BlockedContact) => {
    Alert.alert(
      t('blacklist.unblock'),
      t('blacklist.unblockConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: () => {
            setBlockedContacts(prev => prev.filter(c => c.id !== contact.id));
          },
        },
      ],
    );
  };

  const renderBlockedContact = ({ item }: { item: BlockedContact }) => (
    <View style={[styles.contactCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.contactHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.error }]}>
          <Icon name="block-helper" size={24} color="white" />
        </View>
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.contactPhone, { color: theme.colors.textSecondary }]}>
            {item.phone}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleUnblock(item)}
          style={styles.unblockButton}
        >
          <Icon name="lock-open-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Icon name="phone-cancel" size={20} color={theme.colors.error} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {item.callsBlocked}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t('blacklist.callsBlocked')}
          </Text>
        </View>
        <View style={styles.stat}>
          <Icon name="message-off" size={20} color={theme.colors.warning} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {item.messagesBlocked}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t('blacklist.messagesBlocked')}
          </Text>
        </View>
        <View style={styles.stat}>
          <Icon name="calendar-clock" size={20} color={theme.colors.info} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {formatDate(item.blockedDate)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t('blacklist.blockedSince')}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Stats Header */}
      <View style={[styles.statsHeader, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerStat}>
          <Text style={styles.headerStatValue}>{blockedContacts.length}</Text>
          <Text style={styles.headerStatLabel}>Contacts bloqués</Text>
        </View>
        <View style={styles.headerStat}>
          <Text style={styles.headerStatValue}>
            {blockedContacts.reduce((sum, c) => sum + c.callsBlocked, 0)}
          </Text>
          <Text style={styles.headerStatLabel}>Appels bloqués</Text>
        </View>
        <View style={styles.headerStat}>
          <Text style={styles.headerStatValue}>
            {blockedContacts.reduce((sum, c) => sum + c.messagesBlocked, 0)}
          </Text>
          <Text style={styles.headerStatLabel}>SMS bloqués</Text>
        </View>
      </View>

      {/* Blocked Contacts List */}
      <FlatList
        data={blockedContacts}
        renderItem={renderBlockedContact}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="shield-check" size={64} color={theme.colors.success} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {t('blacklist.empty')}
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    elevation: 4,
  },
  headerStat: {
    alignItems: 'center',
  },
  headerStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  contactCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactPhone: {
    fontSize: 14,
    marginTop: 2,
  },
  unblockButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});

export default BlacklistScreen;