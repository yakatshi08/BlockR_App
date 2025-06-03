import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traductions françaises
const resources = {
  fr: {
    translation: {
      navigation: {
        home: 'Accueil',
        contacts: 'Contacts',
        blacklist: 'Liste noire',
        schedule: 'Planning',
        settings: 'Paramètres',
      },
      home: {
        title: 'BlockR',
        subtitle: 'Votre protection contre les appels indésirables',
        activeBlacklist: 'Contacts bloqués',
        blockedToday: "Bloqués aujourd'hui",
        scheduledRules: 'Règles programmées',
        quickActions: 'Actions rapides',
      },
      blacklist: {
        unblock: 'Débloquer',
        unblockConfirm: 'Voulez-vous débloquer ce contact ?',
        callsBlocked: 'Appels bloqués',
        messagesBlocked: 'SMS bloqués',
        blockedSince: 'Bloqué depuis',
        empty: 'Aucun contact bloqué',
      },
      common: {
        cancel: 'Annuler',
        confirm: 'Confirmer',
        save: 'Sauvegarder',
        delete: 'Supprimer',
        edit: 'Modifier',
        add: 'Ajouter',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;