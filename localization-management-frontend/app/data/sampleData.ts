import type { TranslationKey } from '../schemas';

export const sampleTranslations: TranslationKey[] = [
  {
    id: '1',
    key: 'button.save',
    category: 'buttons',
    description: 'Save button text',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin@example.com',
    lastModified: '2024-01-20T14:30:00Z',
    translations: {
      en: { value: 'Save', updatedAt: '2024-01-15T10:00:00Z', updatedBy: 'admin@example.com' },
      es: { value: 'Guardar', updatedAt: '2024-01-16T09:15:00Z', updatedBy: 'translator@example.com' },
      fr: { value: 'Sauvegarder', updatedAt: '2024-01-17T11:20:00Z', updatedBy: 'translator@example.com' }
    }
  },
  {
    id: '2',
    key: 'button.cancel',
    category: 'buttons',
    description: 'Cancel button text',
    createdAt: '2024-01-15T10:05:00Z',
    createdBy: 'admin@example.com',
    lastModified: '2024-01-18T16:45:00Z',
    translations: {
      en: { value: 'Cancel', updatedAt: '2024-01-15T10:05:00Z', updatedBy: 'admin@example.com' },
      es: { value: 'Cancelar', updatedAt: '2024-01-16T09:20:00Z', updatedBy: 'translator@example.com' },
      fr: { value: 'Annuler', updatedAt: '2024-01-17T11:25:00Z', updatedBy: 'translator@example.com' }
    }
  },
  {
    id: '3',
    key: 'form.email.label',
    category: 'forms',
    description: 'Email field label',
    createdAt: '2024-01-16T14:20:00Z',
    createdBy: 'developer@example.com',
    lastModified: '2024-01-19T10:10:00Z',
    translations: {
      en: { value: 'Email Address', updatedAt: '2024-01-16T14:20:00Z', updatedBy: 'developer@example.com' },
      es: { value: 'Dirección de Correo', updatedAt: '2024-01-17T08:30:00Z', updatedBy: 'translator@example.com' },
      fr: { value: 'Adresse E-mail', updatedAt: '2024-01-18T13:15:00Z', updatedBy: 'translator@example.com' }
    }
  },
  {
    id: '4',
    key: 'notification.welcome',
    category: 'notifications',
    description: 'Welcome notification message',
    createdAt: '2024-01-20T09:00:00Z',
    createdBy: 'developer@example.com',
    lastModified: '2024-01-20T09:00:00Z',
    translations: {}
  }
];

// Simulate API delay for realistic feel
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 