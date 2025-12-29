/**
 * Custom hook for AI operations with caching and error handling.
 * Centralizes AI-related API calls and state management.
 */
import { useState, useCallback, useRef } from 'react';
import { askAva, scoreLeadWithAI, generateEmailWithAI, estimateTokens, estimateResponseTime } from '../lib/dataService';

// Simple in-memory cache for AI responses
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ promptTokens: 0, responseTokens: 0, totalTime: 0 });
  const abortControllerRef = useRef(null);

  // Generate cache key from parameters
  const getCacheKey = useCallback((operation, params) => {
    return `${operation}:${JSON.stringify(params)}`;
  }, []);

  // Check cache for response
  const getFromCache = useCallback((key) => {
    const cached = responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    responseCache.delete(key);
    return null;
  }, []);

  // Store response in cache
  const setCache = useCallback((key, data) => {
    responseCache.set(key, { data, timestamp: Date.now() });
    
    // Clean up old cache entries (simple LRU)
    if (responseCache.size > 50) {
      const firstKey = responseCache.keys().next().value;
      responseCache.delete(firstKey);
    }
  }, []);

  // Chat with Ava
  const chat = useCallback(async (prompt, useCache = true) => {
    const cacheKey = getCacheKey('chat', { prompt });
    
    // Check cache first
    if (useCache) {
      const cached = getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const startTime = Date.now();
      const promptTokens = estimateTokens(prompt);
      
      const response = await askAva(prompt);
      
      const totalTime = Date.now() - startTime;
      const responseTokens = estimateTokens(response.content);
      
      setStats({
        promptTokens,
        responseTokens,
        totalTime,
      });

      // Cache successful response
      if (useCache) {
        setCache(cacheKey, response);
      }

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCacheKey, getFromCache, setCache]);

  // Score a lead with AI
  const scoreLead = useCallback(async (lead, useCache = true) => {
    const cacheKey = getCacheKey('scoreLead', { leadId: lead.id });
    
    if (useCache) {
      const cached = getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await scoreLeadWithAI(lead);
      
      if (useCache) {
        setCache(cacheKey, result);
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCacheKey, getFromCache, setCache]);

  // Generate email with AI
  const generateEmail = useCallback(async (lead, prompt, tone = 'professional', length = 'medium', useCache = false) => {
    // Don't cache email generation by default (usually want fresh content)
    const cacheKey = getCacheKey('generateEmail', { leadId: lead.id, prompt, tone, length });
    
    if (useCache) {
      const cached = getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await generateEmailWithAI(lead, prompt, tone, length);
      
      if (useCache) {
        setCache(cacheKey, result);
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCacheKey, getFromCache, setCache]);

  // Cancel ongoing requests
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    responseCache.clear();
  }, []);

  return {
    chat,
    scoreLead,
    generateEmail,
    loading,
    error,
    stats,
    cancel,
    clearCache,
  };
};
