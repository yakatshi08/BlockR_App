import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeContext';

interface ScheduleRule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  isActive: boolean;
  type: 'block' | 'allow';
}

const ScheduleScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [rules, setRules] = useState<ScheduleRule[]>([
    {
      id: '1',
      name: 'Heures de travail',
      startTime: '09:00',
      endTime: '18:00',
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
      isActive: true,
      type: 'allow',
    },
    {
      id: '2',
      name: 'Nuit tranquille',
      startTime: '22:00',
      endTime: '07:00',
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      isActive: true,
      type: 'block',
    },
    {
      id: '3',
      name: 'Weekend relax',
      startTime: '10:00',
      endTime: '20:00',
      days: ['Sam', 'Dim'],
      isActive: false,
      type: 'allow',
    },
  ]);

  const toggleRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const renderRule = ({ item }: { item: ScheduleRule }) => (
    <View style={[styles.ruleCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.ruleHeader}>
        <View style={styles.ruleInfo}>
          <View style={styles.ruleTitleRow}>
            <Text style={[styles.ruleName, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <View style={[
              styles.typeChip,
              { backgroundColor: item.type === 'block' ? theme.colors.error : theme.colors.success }
            ]}>
              <Text style={styles.typeText}>
                {item.type === 'block' ? 'Bloquer' : 'Autoriser'}
              </Text>
            </View>
          </View>
          <Text style={[styles.ruleTime, { color: theme.colors.textSecondary }]}>
            {item.startTime} - {item.endTime}
          </Text>
          <View style={styles.daysContainer}>
            {item.days.map((day, index) => (
              <View
                key={index}
                style={[styles.dayChip, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>
        <Switch
          value={item.isActive}
          onValueChange={() => toggleRule(item.id)}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary + '40',
          }}
          thumbColor={item.isActive ? theme.colors.primary : theme.colors.textSecondary}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Info */}
      <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <Icon name="information" size={24} color={theme.colors.info} />
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Programmez des règles de blocage automatiques selon vos horaires
        </Text>
      </View>

      {/* Rules List */}
      <FlatList
        data={rules}
        renderItem={renderRule}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-clock" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Aucune règle programmée
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  ruleCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ruleInfo: {
    flex: 1,
  },
  ruleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  ruleTime: {
    fontSize: 14,
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  dayText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
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

export default ScheduleScreen;