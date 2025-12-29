import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';
import { X, Menu, ChevronRight, ChevronDown, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Advanced Navigation Components - 100% Responsive
 */

// Responsive Sidebar with Mobile Drawer
export const ResponsiveSidebar = ({ 
  items = [], 
  logo, 
  collapsed = false,
  onCollapse,
  className,
  children 
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      {logo && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {logo}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path || '#'}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                'text-sm font-medium transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                isActive && 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                !isActive && 'text-gray-700 dark:text-gray-300'
              )}
            >
              {Icon && <Icon size={18} />}
              <span className={cn(collapsed && 'lg:hidden')}>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {children}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setMobileOpen(false);
            }
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full',
          'bg-white dark:bg-gray-800',
          'border-r border-gray-200 dark:border-gray-700',
          'transition-all duration-300',
          // Desktop
          collapsed ? 'lg:w-16' : 'lg:w-64',
          // Mobile
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

// Breadcrumbs - Responsive with overflow handling
export const Breadcrumbs = ({ items = [], className }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <nav className={cn('flex items-center gap-2 flex-wrap', className)}>
      <Link
        to="/"
        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Home size={16} />
      </Link>
      
      {visibleItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-gray-400" />
          {index === visibleItems.length - 1 ? (
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path || '#'}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors truncate max-w-[150px]"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
      
      {hasMore && !showAll && (
        <>
          <ChevronRight size={14} className="text-gray-400" />
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ...
          </button>
        </>
      )}
    </nav>
  );
};

// Top Bar / Header with responsive actions
export const TopBar = ({ 
  title, 
  subtitle,
  actions = [],
  breadcrumbs,
  className 
}) => {
  return (
    <div
      className={cn(
        'sticky top-0 z-30',
        'bg-white dark:bg-gray-800',
        'border-b border-gray-200 dark:border-gray-700',
        'px-4 sm:px-6 lg:px-8',
        'py-4',
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <div className="mb-3">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions.map((action, index) => (
                <React.Fragment key={index}>{action}</React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mega Menu - Responsive dropdown with categories
export const MegaMenu = ({ trigger, categories = [], className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          'text-sm font-medium',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'transition-colors'
        )}
      >
        {trigger}
        <ChevronDown
          size={16}
          className={cn('transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-2',
            'w-screen max-w-4xl',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-xl shadow-2xl',
            'p-6',
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
            className
          )}
        >
          {categories.map((category, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIndex}
                      to={item.path || '#'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {Icon && <Icon size={18} className="text-gray-400" />}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Collapsible Menu - Accordion style with nested items
export const CollapsibleMenu = ({ items = [], className }) => {
  const [openItems, setOpenItems] = useState([]);
  const location = useLocation();

  const toggleItem = (index) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={cn('space-y-1', className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isOpen = openItems.includes(index);
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div key={index}>
            <button
              onClick={() => hasChildren && toggleItem(index)}
              className={cn(
                'w-full flex items-center justify-between gap-3',
                'px-3 py-2.5 rounded-lg',
                'text-sm font-medium transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                location.pathname === item.path && 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                !hasChildren && location.pathname !== item.path && 'text-gray-700 dark:text-gray-300'
              )}
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon size={18} />}
                <span>{item.label}</span>
              </div>
              {hasChildren && (
                <ChevronDown
                  size={16}
                  className={cn('transition-transform', isOpen && 'rotate-180')}
                />
              )}
            </button>

            {hasChildren && isOpen && (
              <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                {item.children.map((child, childIndex) => {
                  const ChildIcon = child.icon;
                  return (
                    <Link
                      key={childIndex}
                      to={child.path || '#'}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg',
                        'text-sm transition-all',
                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                        location.pathname === child.path
                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {ChildIcon && <ChildIcon size={16} />}
                      <span>{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

ResponsiveSidebar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.elementType,
    label: PropTypes.string,
    path: PropTypes.string,
    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })),
  logo: PropTypes.node,
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    path: PropTypes.string
  })),
  className: PropTypes.string
};

TopBar.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.node),
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    path: PropTypes.string
  })),
  className: PropTypes.string
};

MegaMenu.propTypes = {
  trigger: PropTypes.node.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.elementType,
      label: PropTypes.string,
      path: PropTypes.string,
      description: PropTypes.string
    }))
  })),
  className: PropTypes.string
};

CollapsibleMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.elementType,
    label: PropTypes.string,
    path: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.elementType,
      label: PropTypes.string,
      path: PropTypes.string
    }))
  })),
  className: PropTypes.string
};
