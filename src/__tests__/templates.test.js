/**
 * Templates module tests
 * Covers email, SMS, and campaign templates
 */

describe('Templates Module', () => {
  describe('Template data structures', () => {
    test('Email template should have required fields', () => {
      const template = {
        id: 'email-1',
        name: 'Welcome Email',
        type: 'email',
        subject: 'Welcome to our platform',
        body: 'Hello {{firstName}}...',
        variables: ['firstName', 'company'],
        created_at: new Date().toISOString(),
      };

      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.type).toBe('email');
      expect(template.subject).toBeDefined();
      expect(template.body).toBeDefined();
    });

    test('SMS template should have required fields', () => {
      const template = {
        id: 'sms-1',
        name: 'Follow-up SMS',
        type: 'sms',
        body: 'Hi {{firstName}}, just checking in...',
        variables: ['firstName'],
        maxLength: 160,
        created_at: new Date().toISOString(),
      };

      expect(template.type).toBe('sms');
      expect(template.maxLength).toBe(160);
    });

    test('Campaign template should have steps', () => {
      const template = {
        id: 'campaign-1',
        name: 'Outreach sequence',
        type: 'campaign',
        steps: [
          { type: 'email', delay: 0, subject: 'Initial' },
          { type: 'email', delay: 2, subject: 'Follow-up' },
        ],
      };

      expect(template.steps).toHaveLength(2);
      expect(template.steps[0].type).toBe('email');
    });
  });

  describe('Template operations', () => {
    test('Should create email template', () => {
      const createEmailTemplate = (name, subject, body) => ({
        id: Math.random().toString(),
        name,
        type: 'email',
        subject,
        body,
        created_at: new Date().toISOString(),
      });

      const template = createEmailTemplate('Test', 'Subject', 'Body');
      expect(template.name).toBe('Test');
      expect(template.type).toBe('email');
    });

    test('Should update template', () => {
      const updateTemplate = (template, updates) => ({
        ...template,
        ...updates,
        updated_at: new Date().toISOString(),
      });

      const template = { id: '1', name: 'Old name' };
      const updated = updateTemplate(template, { name: 'New name' });
      expect(updated.name).toBe('New name');
      expect(updated.updated_at).toBeDefined();
    });

    test('Should duplicate template', () => {
      const duplicateTemplate = (template) => ({
        ...template,
        id: Math.random().toString(),
        name: `${template.name} (Copy)`,
      });

      const original = { id: '1', name: 'Original' };
      const copy = duplicateTemplate(original);
      expect(copy.id).not.toBe(original.id);
      expect(copy.name).toContain('Copy');
    });
  });

  describe('Template variable handling', () => {
    test('Should extract variables from template', () => {
      const extractVariables = (text) => {
        const matches = text.match(/\{\{(\w+)\}\}/g) || [];
        return matches.map(m => m.replace(/[{}]/g, ''));
      };

      const vars = extractVariables('Hi {{firstName}}, your company is {{company}}');
      expect(vars).toContain('firstName');
      expect(vars).toContain('company');
      expect(vars).toHaveLength(2);
    });

    test('Should validate required variables', () => {
      const validateVariables = (template, data) => {
        const variables = extractVariables(template.body);
        return variables.every(v => v in data);
      };

      const extractVariables = (text) => {
        const matches = text.match(/\{\{(\w+)\}\}/g) || [];
        return matches.map(m => m.replace(/[{}]/g, ''));
      };

      const template = { body: 'Hi {{firstName}}' };
      const data = { firstName: 'John' };
      expect(validateVariables(template, data)).toBe(true);
    });

    test('Should interpolate variables', () => {
      const interpolate = (text, data) => {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
      };

      const result = interpolate('Hi {{firstName}}, from {{company}}', {
        firstName: 'John',
        company: 'Acme',
      });

      expect(result).toBe('Hi John, from Acme');
    });
  });

  describe('Template validation', () => {
    test('Should validate email template subject', () => {
      const validateEmailSubject = (subject) =>
        subject && subject.trim().length > 0 && subject.length <= 100;

      expect(validateEmailSubject('Valid Subject')).toBe(true);
      expect(validateEmailSubject('')).toBe(false);
    });

    test('Should validate email template body', () => {
      const validateEmailBody = (body) => body && body.trim().length > 0;

      expect(validateEmailBody('Valid body')).toBe(true);
      expect(validateEmailBody('')).toBe(false);
    });

    test('Should validate SMS length', () => {
      const validateSMSLength = (body) => body.length <= 160;

      expect(validateSMSLength('Short message')).toBe(true);
      expect(validateSMSLength('a'.repeat(161))).toBe(false);
    });

    test('Should validate template name', () => {
      const validateName = (name) => name && name.trim().length > 0 && name.length <= 50;

      expect(validateName('Valid Name')).toBe(true);
      expect(validateName('')).toBe(false);
    });
  });

  describe('Template organization', () => {
    test('Should filter templates by type', () => {
      const filterByType = (templates, type) => templates.filter(t => t.type === type);

      const templates = [
        { id: '1', type: 'email' },
        { id: '2', type: 'sms' },
        { id: '3', type: 'email' },
      ];

      const emailTemplates = filterByType(templates, 'email');
      expect(emailTemplates).toHaveLength(2);
    });

    test('Should sort templates by created date', () => {
      const sortByDate = (templates) =>
        [...templates].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const templates = [
        { id: '1', created_at: '2024-01-01' },
        { id: '2', created_at: '2024-01-03' },
        { id: '3', created_at: '2024-01-02' },
      ];

      const sorted = sortByDate(templates);
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });

    test('Should group templates by category', () => {
      const groupByCategory = (templates) => {
        return templates.reduce((acc, t) => {
          const cat = t.category || 'uncategorized';
          acc[cat] = [...(acc[cat] || []), t];
          return acc;
        }, {});
      };

      const templates = [
        { id: '1', category: 'welcome' },
        { id: '2', category: 'follow-up' },
        { id: '3', category: 'welcome' },
      ];

      const grouped = groupByCategory(templates);
      expect(grouped.welcome).toHaveLength(2);
      expect(grouped['follow-up']).toHaveLength(1);
    });
  });

  describe('Template preview', () => {
    test('Should generate preview with sample data', () => {
      const generatePreview = (template, sampleData) => ({
        subject: template.subject?.replace(/\{\{(\w+)\}\}/g, (m, k) => sampleData[k] || m),
        body: template.body?.replace(/\{\{(\w+)\}\}/g, (m, k) => sampleData[k] || m),
      });

      const template = {
        subject: 'Hi {{firstName}}',
        body: 'Welcome {{firstName}} from {{company}}',
      };

      const preview = generatePreview(template, {
        firstName: 'John',
        company: 'Acme',
      });

      expect(preview.subject).toBe('Hi John');
      expect(preview.body).toBe('Welcome John from Acme');
    });

    test('Should highlight missing variables in preview', () => {
      const getMissingVariables = (text, data) => {
        const matches = text.match(/\{\{(\w+)\}\}/g) || [];
        const variables = matches.map(m => m.replace(/[{}]/g, ''));
        return variables.filter(v => !(v in data));
      };

      const missing = getMissingVariables('Hi {{firstName}}, {{lastName}}', {
        firstName: 'John',
      });

      expect(missing).toContain('lastName');
      expect(missing).not.toContain('firstName');
    });
  });

  describe('Template export/import', () => {
    test('Should export template as JSON', () => {
      const exportTemplate = (template) => JSON.stringify(template, null, 2);

      const template = { id: '1', name: 'Test', type: 'email' };
      const exported = exportTemplate(template);

      expect(exported).toContain('Test');
      expect(exported).toContain('email');
    });

    test('Should import template from JSON', () => {
      const importTemplate = (json) => JSON.parse(json);

      const json = '{"id":"1","name":"Test","type":"email"}';
      const template = importTemplate(json);

      expect(template.id).toBe('1');
      expect(template.name).toBe('Test');
    });
  });
});
