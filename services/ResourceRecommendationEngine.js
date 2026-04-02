/**
 * Resource Recommendation Engine
 * Hybrid recommendation system combining collaborative filtering, content-based filtering,
 * popularity-based ranking, and domain trust weighting
 */

class ResourceRecommendationEngine {
  constructor() {
    this.resourceDatabase = this.initializeResourceDatabase();
    this.userInteractions = new Map(); // Store user interaction history
    this.domainTrustWeights = this.initializeTrustWeights();
  }

  initializeResourceDatabase() {
    return {
      'IT': {
        'HTML': [
          { id: 'html_1', title: 'HTML Fundamentals - W3Schools', url: 'https://www.w3schools.com/html/', type: 'tutorial', difficulty: 'beginner', rating: 4.8, trustScore: 0.95 },
          { id: 'html_2', title: 'HTML Crash Course - freeCodeCamp', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', type: 'course', difficulty: 'beginner', rating: 4.9, trustScore: 0.98 },
          { id: 'html_3', title: 'HTML Reference - MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', type: 'reference', difficulty: 'all', rating: 4.9, trustScore: 0.99 },
          { id: 'html_4', title: 'HTML5 Semantic Elements - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/html5-semantics/', type: 'article', difficulty: 'intermediate', rating: 4.6, trustScore: 0.85 }
        ],
        'CSS': [
          { id: 'css_1', title: 'CSS Complete Guide - W3Schools', url: 'https://www.w3schools.com/css/', type: 'tutorial', difficulty: 'beginner', rating: 4.7, trustScore: 0.95 },
          { id: 'css_2', title: 'CSS Grid & Flexbox - freeCodeCamp', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', type: 'course', difficulty: 'intermediate', rating: 4.8, trustScore: 0.98 },
          { id: 'css_3', title: 'CSS Tricks & Tips - CSS-Tricks', url: 'https://css-tricks.com/', type: 'blog', difficulty: 'all', rating: 4.9, trustScore: 0.92 },
          { id: 'css_4', title: 'Advanced CSS Animations - YouTube', url: 'https://www.youtube.com/watch?v=jgw82b5Y2MU', type: 'video', difficulty: 'advanced', rating: 4.5, trustScore: 0.80 }
        ],
        'JavaScript': [
          { id: 'js_1', title: 'JavaScript Basics - W3Schools', url: 'https://www.w3schools.com/js/', type: 'tutorial', difficulty: 'beginner', rating: 4.6, trustScore: 0.95 },
          { id: 'js_2', title: 'JavaScript Algorithms - freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', type: 'course', difficulty: 'intermediate', rating: 4.9, trustScore: 0.98 },
          { id: 'js_3', title: 'You Don\'t Know JS - GitHub', url: 'https://github.com/getify/You-Dont-Know-JS', type: 'book', difficulty: 'advanced', rating: 4.8, trustScore: 0.90 },
          { id: 'js_4', title: 'JavaScript Interview Questions - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/javascript-interview-questions-and-answers/', type: 'practice', difficulty: 'intermediate', rating: 4.4, trustScore: 0.85 }
        ],
        'React': [
          { id: 'react_1', title: 'React Official Tutorial', url: 'https://reactjs.org/tutorial/tutorial.html', type: 'tutorial', difficulty: 'beginner', rating: 4.8, trustScore: 0.99 },
          { id: 'react_2', title: 'React Hooks Course - freeCodeCamp', url: 'https://www.freecodecamp.org/news/react-hooks-course/', type: 'course', difficulty: 'intermediate', rating: 4.7, trustScore: 0.98 },
          { id: 'react_3', title: 'React Patterns - GitHub', url: 'https://github.com/reactpatterns/reactpatterns.com', type: 'reference', difficulty: 'advanced', rating: 4.6, trustScore: 0.88 }
        ]
      },
      'DataScience': {
        'Python': [
          { id: 'py_1', title: 'Python for Everybody - Coursera', url: 'https://www.coursera.org/specializations/python', type: 'course', difficulty: 'beginner', rating: 4.8, trustScore: 0.95 },
          { id: 'py_2', title: 'Python Data Science - Kaggle Learn', url: 'https://www.kaggle.com/learn/python', type: 'course', difficulty: 'beginner', rating: 4.7, trustScore: 0.92 },
          { id: 'py_3', title: 'Advanced Python - Real Python', url: 'https://realpython.com/', type: 'tutorial', difficulty: 'advanced', rating: 4.9, trustScore: 0.94 }
        ],
        'MachineLearning': [
          { id: 'ml_1', title: 'Machine Learning Course - Coursera', url: 'https://www.coursera.org/learn/machine-learning', type: 'course', difficulty: 'intermediate', rating: 4.9, trustScore: 0.98 },
          { id: 'ml_2', title: 'ML Crash Course - Google', url: 'https://developers.google.com/machine-learning/crash-course', type: 'course', difficulty: 'beginner', rating: 4.8, trustScore: 0.96 },
          { id: 'ml_3', title: 'Kaggle Competitions', url: 'https://www.kaggle.com/competitions', type: 'practice', difficulty: 'all', rating: 4.7, trustScore: 0.92 }
        ]
      },
      'Finance': {
        'Accounting': [
          { id: 'acc_1', title: 'Financial Accounting - Khan Academy', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance', type: 'course', difficulty: 'beginner', rating: 4.6, trustScore: 0.90 },
          { id: 'acc_2', title: 'Corporate Finance - CFI', url: 'https://corporatefinanceinstitute.com/', type: 'course', difficulty: 'intermediate', rating: 4.7, trustScore: 0.88 }
        ]
      }
    };
  }

  initializeTrustWeights() {
    return {
      'w3schools.com': 0.95,
      'freecodecamp.org': 0.98,
      'developer.mozilla.org': 0.99,
      'geeksforgeeks.org': 0.85,
      'coursera.org': 0.95,
      'kaggle.com': 0.92,
      'khanacademy.org': 0.90,
      'youtube.com': 0.75,
      'github.com': 0.88,
      'css-tricks.com': 0.92,
      'realpython.com': 0.94
    };
  }

  // Content-Based Filtering
  contentBasedRecommendation(userProfile, topic) {
    const { domain, level, preferences } = userProfile;
    const resources = this.resourceDatabase[domain]?.[topic] || [];
    
    return resources.filter(resource => {
      // Filter by difficulty level
      if (level === 'beginner' && resource.difficulty === 'advanced') return false;
      if (level === 'advanced' && resource.difficulty === 'beginner') return false;
      
      // Filter by preferences
      if (preferences?.type && !preferences.type.includes(resource.type)) return false;
      
      return true;
    }).map(resource => ({
      ...resource,
      contentScore: this.calculateContentScore(resource, userProfile)
    }));
  }

  // Collaborative Filtering
  collaborativeFiltering(userId, topic) {
    // Simulate collaborative filtering based on similar users
    const similarUsers = this.findSimilarUsers(userId);
    const recommendations = new Map();
    
    similarUsers.forEach(similarUser => {
      const userResources = this.userInteractions.get(similarUser) || [];
      userResources.forEach(resource => {
        if (resource.topic === topic) {
          const current = recommendations.get(resource.id) || { ...resource, collaborativeScore: 0, count: 0 };
          current.collaborativeScore += resource.rating;
          current.count += 1;
          recommendations.set(resource.id, current);
        }
      });
    });

    return Array.from(recommendations.values()).map(rec => ({
      ...rec,
      collaborativeScore: rec.collaborativeScore / rec.count
    }));
  }

  // Popularity-Based Ranking
  popularityBasedRanking(resources) {
    return resources.map(resource => ({
      ...resource,
      popularityScore: resource.rating * 0.7 + (resource.views || 1000) / 10000 * 0.3
    }));
  }

  // Domain Trust Weighting
  applyTrustWeighting(resources) {
    return resources.map(resource => {
      const domain = this.extractDomain(resource.url);
      const trustWeight = this.domainTrustWeights[domain] || 0.5;
      return {
        ...resource,
        trustScore: resource.trustScore * trustWeight,
        finalScore: (resource.contentScore || 0.5) * 0.3 + 
                   (resource.collaborativeScore || 0.5) * 0.3 + 
                   (resource.popularityScore || 0.5) * 0.2 + 
                   (resource.trustScore || 0.5) * 0.2
      };
    });
  }

  // Main recommendation function
  async getRecommendations(userProfile, topic, limit = 10) {
    try {
      // Get content-based recommendations
      const contentBased = this.contentBasedRecommendation(userProfile, topic);
      
      // Get collaborative filtering recommendations
      const collaborative = this.collaborativeFiltering(userProfile.id, topic);
      
      // Combine and deduplicate
      const allResources = this.combineRecommendations(contentBased, collaborative);
      
      // Apply popularity ranking
      const withPopularity = this.popularityBasedRanking(allResources);
      
      // Apply trust weighting
      const withTrust = this.applyTrustWeighting(withPopularity);
      
      // Sort by final score and return top recommendations
      const recommendations = withTrust
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, limit)
        .map(resource => ({
          id: resource.id,
          title: resource.title,
          url: resource.url,
          type: resource.type,
          difficulty: resource.difficulty,
          rating: resource.rating,
          trustScore: resource.trustScore,
          finalScore: resource.finalScore,
          reason: this.generateRecommendationReason(resource, userProfile)
        }));

      return {
        success: true,
        recommendations,
        metadata: {
          topic,
          userLevel: userProfile.level,
          totalFound: allResources.length,
          algorithm: 'hybrid'
        }
      };
    } catch (error) {
      console.error('Recommendation engine error:', error);
      return {
        success: false,
        error: error.message,
        recommendations: []
      };
    }
  }

  // Helper methods
  calculateContentScore(resource, userProfile) {
    let score = 0.5;
    
    // Level matching
    if (resource.difficulty === userProfile.level) score += 0.3;
    else if (resource.difficulty === 'all') score += 0.2;
    
    // Type preference
    if (userProfile.preferences?.type?.includes(resource.type)) score += 0.2;
    
    // Rating factor
    score += (resource.rating - 3) / 10; // Normalize rating to 0.2 range
    
    return Math.min(1, Math.max(0, score));
  }

  findSimilarUsers(userId) {
    // Simulate finding similar users based on learning patterns
    // In production, this would use actual user similarity algorithms
    return ['user1', 'user2', 'user3'].filter(id => id !== userId);
  }

  combineRecommendations(contentBased, collaborative) {
    const combined = new Map();
    
    // Add content-based recommendations
    contentBased.forEach(resource => {
      combined.set(resource.id, resource);
    });
    
    // Merge collaborative recommendations
    collaborative.forEach(resource => {
      if (combined.has(resource.id)) {
        const existing = combined.get(resource.id);
        existing.collaborativeScore = resource.collaborativeScore;
      } else {
        combined.set(resource.id, resource);
      }
    });
    
    return Array.from(combined.values());
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown.com';
    }
  }

  generateRecommendationReason(resource, userProfile) {
    const reasons = [];
    
    if (resource.difficulty === userProfile.level) {
      reasons.push(`Perfect for ${userProfile.level} level`);
    }
    
    if (resource.rating >= 4.5) {
      reasons.push('Highly rated by learners');
    }
    
    if (resource.trustScore >= 0.9) {
      reasons.push('From trusted educational source');
    }
    
    if (resource.type === 'practice') {
      reasons.push('Hands-on practice opportunity');
    }
    
    return reasons.join(', ') || 'Recommended for your learning path';
  }

  // Track user interactions for collaborative filtering
  trackUserInteraction(userId, resourceId, rating, topic) {
    if (!this.userInteractions.has(userId)) {
      this.userInteractions.set(userId, []);
    }
    
    const userResources = this.userInteractions.get(userId);
    userResources.push({
      id: resourceId,
      rating,
      topic,
      timestamp: Date.now()
    });
  }

  // Get trending resources
  getTrendingResources(domain, limit = 5) {
    const allResources = [];
    
    if (this.resourceDatabase[domain]) {
      Object.values(this.resourceDatabase[domain]).forEach(topicResources => {
        allResources.push(...topicResources);
      });
    }
    
    return allResources
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map(resource => ({
        id: resource.id,
        title: resource.title,
        url: resource.url,
        type: resource.type,
        rating: resource.rating,
        trustScore: resource.trustScore
      }));
  }
}

module.exports = ResourceRecommendationEngine;