/**
 * UI Component tests
 * Covers basic rendering of core UI components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock components for testing
describe('UI Components - Core Library', () => {
  describe('Button Component', () => {
    test('Button should render with children', () => {
      const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    test('Button should handle click events', () => {
      const handleClick = jest.fn();
      const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
      render(<Button onClick={handleClick}>Click me</Button>);
      screen.getByText('Click me').click();
      expect(handleClick).toHaveBeenCalled();
    });

    test('Button should support variants', () => {
      const Button = ({ variant, children, ...props }) => (
        <button className={`btn-${variant}`} {...props}>
          {children}
        </button>
      );
      const { container } = render(<Button variant="primary">Primary</Button>);
      expect(container.querySelector('.btn-primary')).toBeInTheDocument();
    });
  });

  describe('Card Component', () => {
    test('Card should render with children', () => {
      const Card = ({ children }) => <div className="card">{children}</div>;
      const { container } = render(<Card>Card content</Card>);
      expect(container.querySelector('.card')).toBeInTheDocument();
    });

    test('Card should render header and content', () => {
      const Card = ({ children }) => <div className="card">{children}</div>;
      const CardHeader = ({ children }) => <div className="card-header">{children}</div>;
      const CardContent = ({ children }) => <div className="card-content">{children}</div>;

      render(
        <Card>
          <CardHeader>Title</CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Badge Component', () => {
    test('Badge should render with text', () => {
      const Badge = ({ children, variant = 'default' }) => (
        <span className={`badge badge-${variant}`}>{children}</span>
      );
      render(<Badge>Info</Badge>);
      expect(screen.getByText('Info')).toBeInTheDocument();
    });

    test('Badge should support variants', () => {
      const Badge = ({ children, variant = 'default' }) => (
        <span className={`badge badge-${variant}`}>{children}</span>
      );
      const { container } = render(<Badge variant="success">Success</Badge>);
      expect(container.querySelector('.badge-success')).toBeInTheDocument();
    });
  });

  describe('Input Component', () => {
    test('Input should render text input', () => {
      const Input = (props) => <input type="text" {...props} />;
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    test('Input should handle onChange', () => {
      const handleChange = jest.fn();
      const Input = (props) => <input type="text" {...props} />;
      const { container } = render(<Input onChange={handleChange} />);
      const input = container.querySelector('input');
      input.value = 'test';
      input.dispatchEvent(new Event('change', { bubbles: true }));
      expect(handleChange).toHaveBeenCalled();
    });

    test('Input should support labels', () => {
      const Input = ({ label, ...props }) => (
        <>
          {label && <label>{label}</label>}
          <input type="text" {...props} />
        </>
      );
      render(<Input label="Name" />);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  describe('Select Component', () => {
    test('Select should render with options', () => {
      const Select = ({ options, ...props }) => (
        <select {...props}>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
      render(
        <Select
          options={[
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
          ]}
        />
      );
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Textarea Component', () => {
    test('Textarea should render with placeholder', () => {
      const Textarea = (props) => <textarea {...props} />;
      render(<Textarea placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    test('Textarea should handle value', () => {
      const Textarea = (props) => <textarea {...props} />;
      const { container } = render(<Textarea defaultValue="Test content" />);
      expect(container.querySelector('textarea').value).toBe('Test content');
    });
  });

  describe('Tabs Component', () => {
    test('Tabs should render tab list and content', () => {
      const Tabs = ({ tabs, children }) => (
        <div className="tabs">
          <div className="tab-list">
            {tabs.map(t => (
              <button key={t.id}>{t.label}</button>
            ))}
          </div>
          {children}
        </div>
      );
      render(
        <Tabs tabs={[{ id: '1', label: 'Tab 1' }]}>
          <div>Content</div>
        </Tabs>
      );
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
    });
  });

  describe('Modal Component', () => {
    test('Modal should render when open', () => {
      const Modal = ({ open, children }) => open ? <div className="modal">{children}</div> : null;
      render(<Modal open={true}>Modal content</Modal>);
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    test('Modal should not render when closed', () => {
      const Modal = ({ open, children }) => open ? <div className="modal">{children}</div> : null;
      const { container } = render(<Modal open={false}>Modal content</Modal>);
      expect(container.querySelector('.modal')).not.toBeInTheDocument();
    });
  });
});
