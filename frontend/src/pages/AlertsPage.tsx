import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  Download,
  Bell,
  Search,
  Calendar,
  Layers,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import './AlertsPage.css';

interface Alert {
  id: number;
  title: string;
  location: string;
  type: string;
  time: string;
  timestamp: number;
  month: number;
  year: number;
  description: string;
}

const API_BASE = 'http://localhost:8000';

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [alertsPerPage, setAlertsPerPage] = useState(50);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts/india-all-disasters`);
      const json = await res.json();
      const transformed: Alert[] = json.incidents.map((item: any, index: number) => {
        const dateObj = new Date(item.date);
        return {
          id: index + Date.now(),
          title: item.title,
          location: item.location,
          type: item.category,
          time: dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          timestamp: dateObj.getTime(),
          month: dateObj.getMonth(),
          year: dateObj.getFullYear(),
          description: item.title,
        };
      });
      setAlerts(transformed.sort((a, b) => b.timestamp - a.timestamp));
      setCurrentPage(1); // Reset to first page on new data
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    }
  };

  useEffect(() => { 
    fetchAlerts(); 
  }, []);

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setMonthFilter('all');
    setYearFilter('all');
    setCurrentPage(1);
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            alert.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || alert.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesMonth = monthFilter === 'all' || alert.month === parseInt(monthFilter);
      const matchesYear = yearFilter === 'all' || alert.year === parseInt(yearFilter);
      return matchesSearch && matchesType && matchesMonth && matchesYear;
    });
  }, [alerts, searchTerm, typeFilter, monthFilter, yearFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);
  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = filteredAlerts.slice(indexOfFirstAlert, indexOfLastAlert);

  const years = useMemo(() => Array.from(new Set(alerts.map(a => a.year))).sort((a, b) => b - a), [alerts]);

  // Page number generation
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        end = 5;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const handlePageChange = (pageNumber: number | string) => {
    if (pageNumber === '...') return;
    setCurrentPage(pageNumber as number);
    // Scroll to top of alerts container
    const alertsContainer = document.querySelector('.alerts-container');
    if (alertsContainer) {
      alertsContainer.scrollTop = 0;
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle alerts per page change
  const handleAlertsPerPageChange = (value: number) => {
    setAlertsPerPage(value);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <motion.div className="alerts-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="alerts-header">
        <div className="header-title">
          <div>
            <h1>Disaster Alerts</h1>
            <p className="header-subtitle">Live Intelligence Feed</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="items-per-page-selector">
            <span>Show:</span>
            <select 
              value={alertsPerPage} 
              onChange={(e) => handleAlertsPerPageChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <button className="export-btn"><Download size={18} /> Export</button>
        </div>
      </div>

      <div className="filter-row">
        <div className="search-box main-search">
          <Search size={20} />
          <input 
            placeholder="Search disasters or locations..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        
        <div className="filter-item">
          <Layers size={16} />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">Types</option>
            {Array.from(new Set(alerts.map(a => a.type))).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="filter-item">
          <Calendar size={16} />
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="all">Month</option>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <Clock size={16} />
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="all">Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <motion.button 
          className="clear-filters-btn"
          onClick={clearFilters}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw size={16} />
          Reset
        </motion.button>
      </div>

      <div className="results-label-bar">
        <h3>{filteredAlerts.length} incidents found</h3>
        <div className="pagination-info">
          Showing {indexOfFirstAlert + 1} - {Math.min(indexOfLastAlert, filteredAlerts.length)} of {filteredAlerts.length} alerts
          <span className="page-info">(Page {currentPage} of {totalPages})</span>
        </div>
      </div>

      <div className="alerts-container">
        <motion.div className="alerts-grid" layout>
          <AnimatePresence mode='popLayout'>
            {currentAlerts.map((alert, index) => (
              <motion.div 
                key={alert.id} 
                layout
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.5) }} 
                className={`alert-card type-${alert.type.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="card-header">
                  <span className="type-pill">{alert.type}</span>
                  <div className="date-visibility-box">
                    <Clock size={14} />
                    <span className="date-text-visible">{alert.time}</span>
                  </div>
                </div>
                <h3>{alert.title}</h3>
                <div className="card-footer">
                  <MapPin size={14} /> {alert.location}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Pagination Controls */}
      {filteredAlerts.length > 0 && (
        <div className="pagination-controls">
          <div className="pagination-left">
            <button 
              className="pagination-btn first-page"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <ChevronsLeft size={16} />
              First
            </button>
            <button 
              className="pagination-btn prev-page"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
          </div>
          
          <div className="pagination-numbers">
            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                className={`pagination-number ${pageNumber === currentPage ? 'active' : ''} ${pageNumber === '...' ? 'ellipsis' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
                disabled={pageNumber === '...'}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          
          <div className="pagination-right">
            <button 
              className="pagination-btn next-page"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
            <button 
              className="pagination-btn last-page"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              Last
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AlertsPage;